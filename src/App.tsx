import '../globals.js';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAccessController } from '@orbitdb/core';
import { OrbitDBAddress } from '@orbitdb/core/src/orbitdb.js';

import { startOrbitDB } from './db-services';
import { toString } from 'uint8arrays/to-string';
import ManifestStore from '@orbitdb/core/src/manifest-store.js'

import { ComposedStorage, LRUStorage, IPFSBlockStorage } from '@orbitdb/core';
import LevelStorage from './level-storage';

import CyberflyAccessController from './cyberfly-access-controller';

export default function App() {
  const [orbitdb, setOrbitDB] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [dbAddr, setDbAddr] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useAccessController(CyberflyAccessController);

 useEffect(()=>{

    async function getorbitdb(){
      const ob = await startOrbitDB();
      setOrbitDB(ob);
    }
    getorbitdb();

 },[]);

 useEffect(()=>{

 async function pindb() {
   if (orbitdb) {
      const manifestStore = await ManifestStore({ ipfs:orbitdb.ipfs })

    orbitdb.ipfs.libp2p.addEventListener('peer:discovery', async (evt: any) => {
      console.log('Discovered peer:', evt.detail.id.toString());
    });
    orbitdb.ipfs.libp2p.services.pubsub.subscribe('pindb');
    orbitdb.ipfs.libp2p.services.pubsub.addEventListener('message', async (msg: any) => {
      const { topic, data } = msg.detail;
      if (topic === 'pindb') {
        try {
          let dat = JSON.parse(toString(data));
          if (typeof dat === 'string') {
            dat = JSON.parse(dat);
          }
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
            await orbitdb.open(dat.dbaddr, { entryStorage, headsStorage, indexStorage });
            console.log('Pinned db:', dat.dbaddr);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
  
 }
pindb();
  },[orbitdb]);

  // Handler to open a user-provided db address and show JSON
  const handleLoadDb = async () => {
  if (!orbitdb) { return; }
    const addr = (dbAddr || '').trim();
    if (!addr) {
      setError('Please enter an OrbitDB address');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
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
      const dbInstance = await orbitdb.open(addr, { indexStorage, headsStorage, entryStorage });
      const all = await dbInstance.all();
      setResult(all);
    } catch (e: any) {
      console.log(e);
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

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
        {/* Input form for OrbitDB address */}
  <View style={styles.sectionGap}>
          <Text style={styles.label}>OrbitDB Address</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="/orbitdb/<address>"
              value={dbAddr}
              onChangeText={setDbAddr}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleLoadDb}
              disabled={!orbitdb || loading}
              style={({ pressed }) => [styles.loadBtn, (pressed || loading) && styles.copyBtnPressed, (!orbitdb || loading) && styles.btnDisabled]}
            >
              <Text style={styles.copyText}>{loading ? 'Loading' : 'Load'}</Text>
            </Pressable>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {/* JSON result view */}
        <View style={styles.resultBoxContainer}>
          <Text style={styles.label}>Result</Text>
          <ScrollView style={styles.jsonBox} contentContainerStyle={styles.jsonContent}>
            <Text selectable style={styles.jsonText}>
              {result ? JSON.stringify(result, null, 2) : (loading ? '' : 'No data loaded')}
            </Text>
          </ScrollView>
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
  sectionGap: {
    marginTop: 16,
  },
  resultBoxContainer: {
    marginTop: 16,
    maxHeight: 380,
  },
  jsonContent: {
    padding: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 12,
    color: '#111',
    backgroundColor: '#fff',
  },
  loadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#0b7',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  error: {
    color: '#b00',
    marginTop: 6,
    fontSize: 12,
  },
  jsonBox: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 6,
    backgroundColor: '#f6f8fa',
  },
  jsonText: {
    fontSize: 12,
    color: '#24292f',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
