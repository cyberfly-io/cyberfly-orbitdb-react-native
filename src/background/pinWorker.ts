import BackgroundService from 'react-native-background-actions';
import { startOrbitDB } from '../db-services';
import ManifestStore from '@orbitdb/core/src/manifest-store.js';
import { toString } from 'uint8arrays/to-string';
import { OrbitDBAddress } from '@orbitdb/core/src/orbitdb.js';
import { ComposedStorage, LRUStorage, IPFSBlockStorage } from '@orbitdb/core';
import LevelStorage from '../level-storage';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(resolve, time));

// Optional injection from UI context when available (same JS runtime)
let injectedOrbitdb: any | null = null;
export const setPinWorkerOrbitDB = (instance: any | null) => {
  injectedOrbitdb = instance;
};

// This task runs in a separate JS context managed by the foreground service
export const pinDbTask = async (taskData: { topic?: string }) => {
  const topic = taskData.topic || 'pindb';
  try {
    const orbitdb = injectedOrbitdb ?? await startOrbitDB();
  if (!orbitdb) { return; }
    const manifestStore = await ManifestStore({ ipfs: orbitdb.ipfs });

    // Peer discovery tracking (optional)
    orbitdb.ipfs.libp2p.addEventListener('peer:discovery', (evt: any) => {
      console.log('BG discovered peer:', evt.detail.id?.toString?.());
    });

    // Subscribe to the topic and pin any DBs that match criteria
    orbitdb.ipfs.libp2p.services.pubsub.subscribe(topic);
    orbitdb.ipfs.libp2p.services.pubsub.addEventListener('message', async (msg: any) => {
      const { topic: t, data } = msg.detail;
      if (t !== topic) { return; }
      try {
        let dat = JSON.parse(toString(data));
        if (typeof dat === 'string') { dat = JSON.parse(dat); }
        const addr = OrbitDBAddress(dat.dbaddr);
        const headsStorage = await ComposedStorage(
          await LRUStorage({ size: 1000 }),
          await LevelStorage({ path: `heads_${addr}` }),
        );
        const indexStorage = await ComposedStorage(
          await LRUStorage({ size: 1000 }),
          await LevelStorage({ path: `index_${addr}` }),
        );
        const entryStorage = await ComposedStorage(
          await LRUStorage({ size: 1000 }),
          await IPFSBlockStorage({ ipfs: orbitdb.ipfs, pin: true }),
        );
        const manifest = await manifestStore.get(addr.hash);
        if (manifest.accessController.includes('cyberfly')) {
          console.log(`[BG] Pinning db: ${dat.dbaddr}`);
          await orbitdb.open(dat.dbaddr, { entryStorage, headsStorage, indexStorage });
          console.log('[BG] Pinned db:', dat.dbaddr);
        }
      } catch (e) {
        console.log('[BG] Error while pinning:', e);
      }
    });

    // Keep the service alive
    while (BackgroundService.isRunning()) {
      await sleep(10000);
    }
  } catch (e) {
    console.log('[BG] Failed to start pinDbTask', e);
  }
};

export const startPinService = async () => {
  const options = {
    taskName: 'CyberFly Pin Service',
    taskTitle: 'CyberFly Node',
    taskDesc: 'Listening for OrbitDB pin requests',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#00d4ff',
    parameters: { topic: 'pindb' },
    linkingURI: 'cyberflylibp2papp://',
    foregroundService: true,
    allowExecutionInForeground: true,
  } as const;

  if (!BackgroundService.isRunning()) {
    await BackgroundService.start(pinDbTask, options);
  }
};

export const stopPinService = async () => {
  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
  }
};
