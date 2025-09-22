import '../globals.js';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable, StyleSheet } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAccessController } from '@orbitdb/core';
import { startOrbitDB } from './db-services';
import { getAddress } from './utils';
import { ComposedStorage, LRUStorage, IPFSBlockStorage } from '@orbitdb/core';
import LevelStorage from './level-storage';

import CyberflyAccessController from './cyberfly-access-controller';

export default function App() {
  const [orbitdb, setOrbitDB] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useAccessController(CyberflyAccessController);

 useEffect(()=>{

    async function getorbitdb(){
      const ob = await startOrbitDB();
      setOrbitDB(ob);
    }
    getorbitdb();

 },[]);

 useEffect(()=>{

  if(orbitdb){
    orbitdb.ipfs.libp2p.addEventListener('peer:discovery', async(evt) => { 
      console.log('Discovered peer:', evt.detail.id.toString());
    })
    orbitdb.ipfs.libp2p.services.pubsub.subscribe("test")
    orbitdb.ipfs.libp2p.services.pubsub.addEventListener('message', (msg) => {
        const { topic, data, from } = msg.detail

        if(topic === "test")
         console.log('Received pubsub message:', data ? new TextDecoder().decode(data) : null, 'from', from.toString());
    });
  }

  },[orbitdb]);

  useEffect(()=>{
    if(orbitdb){
async function addData(){

    try{
      const dbname = 'testnewdb1235-94faf73efcd9af950d4dbca3e5c65459221377b6ea31e3ed30112939a5c79aa8';
      const addr = await getAddress(orbitdb, dbname);
      const headsStorage = await ComposedStorage(await LRUStorage({ size: 1000 }), await LevelStorage({ path: `heads_${addr}` }));
      const indexStorage = await ComposedStorage(await LRUStorage({ size: 1000 }), await LevelStorage({ path: `index_${addr}` }));
  if (!orbitdb) { return; }
      const entryStorage = await ComposedStorage(
        await LRUStorage({ size: 1000 }),
        await IPFSBlockStorage({ ipfs: orbitdb.ipfs, pin: true })
      );
    const db = await orbitdb.open(
      'testnewdb1235-94faf73efcd9af950d4dbca3e5c65459221377b6ea31e3ed30112939a5c79aa8',
      { type: 'documents', AccessController: CyberflyAccessController(), indexStorage, headsStorage, entryStorage },
    );
    // Add some records to the db.
    await db.put({
      _id: Math.random(),
      publicKey: '94faf73efcd9af950d4dbca3e5c65459221377b6ea31e3ed30112939a5c79aa8',
      sig: 'df0dc7a643e696848ecbc45b9aeabf285c0be98c2ab91a6d0e54d1aaa65040211babf27fab8bb86a35cafbadf0b0acbb4952a9e9e99c1ff65092f97265983800',
      data: {
        latitude: -78.395184,
        longitude: 149.927618,
        member: 'chai kings',
        locationLabel: 'Coffee shop',
        streamName: 'mystream',
      },
    });
    // Print out the above records.
    console.log(await db.all());

    const db2 = await orbitdb.open(
      "/orbitdb/zdpuAnQwxqZbkm5AKok61YRX6vx4cayztof3qKMjKptdRQKy3",
      { type: 'documents', indexStorage, headsStorage, entryStorage },
    );
    console.log('db2 loaded');
    console.log(await db2.all());
  }
  catch(e){
    console.log(e);
  }

}
addData();
    }
    
  },[orbitdb]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.label}>Libp2p Peer ID</Text>
        <View style={styles.row}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={styles.peerId}>
            {orbitdb ? orbitdb.ipfs.libp2p.peerId.toString() : 'Loading...'}
          </Text>
          {!!orbitdb && (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                const id = orbitdb?.ipfs?.libp2p?.peerId?.toString?.() ?? '';
                if (id) {
                  Clipboard.setString(id);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }
              }}
              style={({ pressed }) => [styles.copyBtn, pressed && styles.copyBtnPressed]}
            >
              <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  peerId: {
    flex: 1,
    fontSize: 12,
    color: '#111',
  },
  copyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#1f6feb',
  },
  copyBtnPressed: {
    opacity: 0.8,
  },
  copyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
