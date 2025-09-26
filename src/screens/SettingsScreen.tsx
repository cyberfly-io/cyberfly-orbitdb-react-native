import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDatabase } from '../context/DatabaseContext';
import { palette, spacing, radii, typography } from '../styles/theme';

const SettingsScreen = () => {
  const { orbitdb, isOnline, connectedPeers, loading } = useDatabase();

  const handleCopyPeerId = async () => {
    if (orbitdb?.ipfs?.libp2p?.peerId) {
      const peerId = orbitdb.ipfs.libp2p.peerId.toString();
      Clipboard.setString(peerId);
      Alert.alert('Copied', 'Peer ID copied to clipboard');
    } else {
      Alert.alert('Error', 'Peer ID not available');
    }
  };

  const getStatusColor = () => {
    if (loading) {
      return '#f59e0b';
    }
    if (isOnline) {
      return '#10b981';
    }
    return '#ef4444';
  };

  const getStatusText = () => {
    if (loading) {
      return 'Connecting...';
    }
    if (isOnline) {
      return 'Online';
    }
    return 'Offline';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings & Status</Text>

      {/* Connection Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.statusValue}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Connected Peers</Text>
            <Text style={styles.statusText}>{connectedPeers}</Text>
          </View>

          {orbitdb?.ipfs?.libp2p?.peerId && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Peer ID</Text>
              <Pressable
                style={({ pressed }) => [styles.peerIdContainer, pressed && styles.pressed]}
                onPress={handleCopyPeerId}
              >
                <Text style={styles.peerIdText} numberOfLines={1}>
                  {orbitdb.ipfs.libp2p.peerId.toString()}
                </Text>
                <Text style={styles.copyText}>📋</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* OrbitDB Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OrbitDB Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>
              {orbitdb ? 'Initialized' : 'Not Initialized'}
            </Text>
          </View>

          {orbitdb?.identity && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Identity ID</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {orbitdb.identity.id}
              </Text>
            </View>
          )}

          {orbitdb?.ipfs && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IPFS Node</Text>
              <Text style={styles.infoValue}>Ready</Text>
            </View>
          )}
        </View>
      </View>

      {/* Network Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Configuration</Text>
        <View style={styles.networkCard}>
          <Text style={styles.networkText}>
            This node uses libp2p for peer-to-peer networking with the following protocols:
          </Text>
          <View style={styles.protocolList}>
            <Text style={styles.protocolItem}>• WebRTC for direct peer connections</Text>
            <Text style={styles.protocolItem}>• WebSockets for relay connections</Text>
            <Text style={styles.protocolItem}>• GossipSub for pub/sub messaging</Text>
            <Text style={styles.protocolItem}>• DHT for peer discovery</Text>
          </View>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>CyberFly OrbitDB</Text>
          <Text style={styles.aboutText}>
            A decentralized database application powered by OrbitDB and libp2p.
            Enabling peer-to-peer data storage and synchronization without central servers.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: typography.heading1,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: '600',
    color: palette.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  statusCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statusLabel: {
    fontSize: typography.small,
    color: palette.textSecondary,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.small,
    fontWeight: '600',
    color: palette.textPrimary,
    marginLeft: spacing.xs,
  },
  peerIdContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  peerIdText: {
    flex: 1,
    fontSize: typography.tiny,
    fontFamily: 'Menlo',
    color: palette.textSecondary,
  },
  copyText: {
    marginLeft: spacing.xs,
    fontSize: typography.body,
  },
  infoCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: typography.small,
    color: palette.textSecondary,
  },
  infoValue: {
    flex: 1,
    fontSize: typography.small,
    fontWeight: '600',
    color: palette.textPrimary,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  networkCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  networkText: {
    fontSize: typography.small,
    color: palette.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  protocolList: {
    marginTop: spacing.xs,
  },
  protocolItem: {
    fontSize: typography.small,
    color: palette.textMuted,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  aboutCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  aboutTitle: {
    fontSize: typography.heading2,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: spacing.xs,
  },
  aboutText: {
    fontSize: typography.small,
    color: palette.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  versionText: {
    fontSize: typography.tiny,
    color: palette.textMuted,
    fontStyle: 'italic',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default SettingsScreen;
