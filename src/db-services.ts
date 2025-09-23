import { createHelia } from 'helia';
import { createOrbitDB, ComposedStorage, LRUStorage } from '@orbitdb/core';
import { Identities, KeyStore } from '@orbitdb/core';
import { config } from './config/libp2pconfig';
import { createLibp2p } from 'libp2p';
import debug from 'debug';
import LevelStorage from './level-storage';
import { LevelBlockstore } from './blockstore-level';

debug.enable('libp2p:*,*:trace');


const startOrbitDB = async () => {
   try{
    console.log('Creating libp2p instance...');
    const libp2p = await createLibp2p(config);
    
    console.log('Starting libp2p...');
    await libp2p.start();
    
    console.log('Libp2p started, peer ID:', libp2p.peerId.toString());
    console.log('Pubsub service:', libp2p.services.pubsub);
    console.log('Pubsub available:', !!libp2p.services.pubsub);
    
    // Try to start pubsub service explicitly if available
    if (libp2p.services.pubsub && typeof (libp2p.services.pubsub as any).start === 'function') {
      console.log('Starting pubsub service explicitly...');
      try {
        await (libp2p.services.pubsub as any).start();
        console.log('Pubsub service started successfully');
      } catch (error) {
        console.log('Failed to start pubsub service:', error);
      }
    }
    
    // Check if pubsub is started
    if (libp2p.services.pubsub && typeof (libp2p.services.pubsub as any).isStarted === 'function') {
      console.log('Pubsub isStarted:', (libp2p.services.pubsub as any).isStarted());
    }
    
    // Wait loop for pubsub to be ready (up to ~10s)
    const waitForPubsubReady = async (timeoutMs: number) => {
      const start = Date.now();
      const hasIsStarted = libp2p.services.pubsub && typeof (libp2p.services.pubsub as any).isStarted === 'function';
      while (Date.now() - start < timeoutMs) {
        if (libp2p.services.pubsub) {
          if (!hasIsStarted) {
            // If no isStarted API, assume presence is enough after brief wait
            break;
          }
          try {
            const started = (libp2p.services.pubsub as any).isStarted();
            if (started) {
              break;
            }
          } catch {
            // ignore and retry
          }
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      const status = libp2p.services.pubsub ? (typeof (libp2p.services.pubsub as any).isStarted === 'function' ? (libp2p.services.pubsub as any).isStarted() : true) : false;
      console.log('Pubsub readiness after wait:', status);
      return status;
    };

    console.log('Waiting for pubsub to be fully ready (up to 10s)...');
    await waitForPubsubReady(10_000);
    
    if (!libp2p.services.pubsub) {
      throw new Error('Pubsub service is not available');
    }
    
    const blockstore = new LevelBlockstore('ipfs_blockstore');
    
    console.log('Creating Helia instance...');
    const ipfs = await createHelia({ libp2p, blockstore });
    
    const keyStorage = await ComposedStorage(await LRUStorage({ size: 1000 }), await LevelStorage({ path: 'keystore' }));
    
    const keystore = await KeyStore({storage: keyStorage});
    const id = 'userA';
    const identities = await Identities({ ipfs, keystore });

    const identity = await identities.createIdentity({ id });
    
    console.log('Creating OrbitDB instance...');
    const orbitdb = await createOrbitDB({ ipfs, identity, identities});
    
    console.log('OrbitDB created successfully!');
    return orbitdb;
   }
   catch(e){
    console.log('libp2p error');
       console.log(e);
   }

   
};

export {
    startOrbitDB,
};
