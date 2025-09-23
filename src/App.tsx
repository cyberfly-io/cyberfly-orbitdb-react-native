import '../globals.js';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAccessController } from '@orbitdb/core';

import { startOrbitDB } from './db-services';
import { ComposedStorage, LRUStorage, IPFSBlockStorage } from '@orbitdb/core';
import LevelStorage from './level-storage';
import CyberflyAccessController from './cyberfly-access-controller';
import { startPinService, setPinWorkerOrbitDB, stopPinService } from './background/pinWorker';

export default function App() {
  const [orbitdb, setOrbitDB] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [dbAddr, setDbAddr] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [connectedPeers, setConnectedPeers] = useState(0);

  useAccessController(CyberflyAccessController);

  useEffect(() => {
    (async () => {
      const ob = await startOrbitDB();
      setOrbitDB(ob);
      setIsOnline(true);
      try {
        // Live peer connection counters (best effort)
        ob.ipfs.libp2p.addEventListener('peer:connect', () => setConnectedPeers((c: number) => c + 1));
        ob.ipfs.libp2p.addEventListener('peer:disconnect', () => setConnectedPeers((c: number) => Math.max(0, c - 1)));
      } catch {}
      // Provide the instance to the background pin worker (same JS context when app is foreground)
      try { setPinWorkerOrbitDB(ob); } catch {}
      // Start background pin service after injection
      try { await startPinService(); } catch {}
    })();
  }, []);

  // Note: startPinService is already called after orbitdb injection above

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

  const handleToggleConnection = async () => {
    try {
      if (isOnline) {
        // Disconnect: stop pin service and Helia/libp2p
        try { await stopPinService(); } catch {}
        try { await orbitdb?.ipfs?.stop?.(); } catch {}
        setIsOnline(false);
        setConnectedPeers(0);
        setPinWorkerOrbitDB(null);
        setOrbitDB(null);
      } else {
        // Connect: create a fresh instance
        const ob = await startOrbitDB();
        setOrbitDB(ob);
        setIsOnline(true);
        try {
          ob.ipfs.libp2p.addEventListener('peer:connect', () => setConnectedPeers((c: number) => c + 1));
          ob.ipfs.libp2p.addEventListener('peer:disconnect', () => setConnectedPeers((c: number) => Math.max(0, c - 1)));
        } catch {}
        try { setPinWorkerOrbitDB(ob); } catch {}
        try { await startPinService(); } catch {}
      }
    } catch (e) {
      console.log('Toggle connection error', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CyberFly Node</Text>
          <View style={[styles.statusPill, isOnline ? styles.statusOn : styles.statusOff]}>
            <View style={[styles.dot, isOnline ? styles.dotOn : styles.dotOff]} />
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>

        {/* Connect Button (VPN-like) */}
        <View style={styles.centerBox}>
          <Pressable onPress={handleToggleConnection} style={({ pressed }) => [styles.vpnOuter, pressed && styles.pressed]}>
            <View style={[styles.vpnInner, isOnline ? styles.vpnInnerOn : styles.vpnInnerOff]}>
              <Text style={styles.vpnLabel}>{isOnline ? 'DISCONNECT' : 'CONNECT'}</Text>
              <Text style={styles.vpnSub}>{isOnline ? `${connectedPeers} peers` : 'Tap to start'}</Text>
            </View>
          </Pressable>
        </View>

        {/* Peer ID Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Peer ID</Text>
          <View style={styles.row}>
            <Text numberOfLines={1} ellipsizeMode="middle" style={styles.cardMono}>
              {orbitdb ? orbitdb.ipfs.libp2p.peerId.toString() : 'Starting…'}
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
                style={({ pressed }) => [styles.ghostBtn, pressed && styles.pressed]}
              >
                <Text style={styles.ghostText}>{copied ? 'Copied' : 'Copy'}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* OrbitDB Loader */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Open OrbitDB</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="/orbitdb/<address>"
              placeholderTextColor="#9aa4b2"
              value={dbAddr}
              onChangeText={setDbAddr}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleLoadDb}
              disabled={!orbitdb || loading}
              style={({ pressed }) => [styles.primaryBtn, (!orbitdb || loading) && styles.btnDisabled, pressed && styles.pressed]}
            >
              <Text style={styles.primaryText}>{loading ? 'Loading' : 'Load'}</Text>
            </Pressable>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {/* Result */}
        <View style={[styles.card, styles.resultCard]}>
          <Text style={styles.cardLabel}>Result</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  screen: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  statusOn: {
    borderColor: 'rgba(16,185,129,0.35)',
    backgroundColor: 'rgba(16,185,129,0.12)',
  },
  statusOff: {
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  statusText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  dotOn: { backgroundColor: '#10b981' },
  dotOff: { backgroundColor: '#64748b' },

  centerBox: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  vpnOuter: {
    width: 200,
    height: 200,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  vpnInner: {
    width: 170,
    height: 170,
    borderRadius: 170,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  vpnInnerOn: {
    backgroundColor: 'rgba(16,185,129,0.18)',
  },
  vpnInnerOff: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  vpnLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  vpnSub: {
    color: '#94a3b8',
    marginTop: 6,
    fontSize: 12,
  },
  pressed: { opacity: 0.8 },

  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    gap: 10,
  },
  cardLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMono: {
    flex: 1,
    fontSize: 12,
    color: '#e2e8f0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  ghostBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ghostText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 12,
    color: '#e2e8f0',
    backgroundColor: 'rgba(2,6,23,0.35)',
  },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
  },
  primaryText: {
    color: '#081018',
    fontSize: 12,
    fontWeight: '800',
  },
  btnDisabled: { opacity: 0.6 },
  error: {
    color: '#fda4af',
    marginTop: 6,
    fontSize: 12,
  },
  resultCard: {
    minHeight: 160,
    maxHeight: 380,
  },
  jsonBox: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    backgroundColor: 'rgba(2,6,23,0.35)',
  },
  jsonContent: { padding: 12 },
  jsonText: {
    fontSize: 12,
    color: '#e2e8f0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
