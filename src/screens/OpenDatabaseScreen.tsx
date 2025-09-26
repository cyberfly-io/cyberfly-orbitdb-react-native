import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';
import { ComposedStorage, LRUStorage, IPFSBlockStorage } from '@orbitdb/core';
import LevelStorage from '../level-storage';

const OpenDatabaseScreen: React.FC = () => {
  const { orbitdb } = useDatabase();
  const [dbAddr, setDbAddr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Open Database</Text>
      <TextInput
        style={styles.input}
        placeholder="orbitdb:/..."
        placeholderTextColor="#64748b"
        value={dbAddr}
        onChangeText={setDbAddr}
      />
      <TouchableOpacity style={styles.button} onPress={handleLoadDb} disabled={loading}>
        {loading ? <ActivityIndicator color="#0b1220" /> : <Text style={styles.buttonText}>Load</Text>}
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Result</Text>
          <Text style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  content: { padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: '#111827',
    color: '#e2e8f0',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#0b1220', fontWeight: '700' },
  error: { color: '#fca5a5', marginTop: 8 },
  resultBox: {
    backgroundColor: '#0b1220',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  resultTitle: { color: '#94a3b8', marginBottom: 6 },
  resultText: { color: '#e2e8f0', fontFamily: 'Menlo' },
});

export default OpenDatabaseScreen;
