import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';
import { palette, spacing, radii, typography } from '../styles/theme';

const formatBytes = (bytes: number): string => {
  if (!bytes) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const StatusBadge = ({ online, loading }: { online: boolean; loading: boolean }) => {
  const copy = loading ? 'Connecting…' : online ? 'Online' : 'Offline';
  const tone = loading ? palette.warning : online ? palette.success : palette.danger;

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${tone}1a` }]}>
      <View style={[styles.statusDot, { backgroundColor: tone }]} />
      <Text style={[styles.statusBadgeText, { color: tone }]}>{copy}</Text>
    </View>
  );
};

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, hint }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {hint ? <Text style={styles.statHint}>{hint}</Text> : null}
  </View>
);

const DashboardScreen: React.FC = () => {
  const {
    isOnline,
    connectedPeers,
    discoveredPeers,
    storageUsedBytes,
    pinServiceRunning,
    loading,
    refreshStorageUsage,
    ensurePinService,
  } = useDatabase();

  const [refreshing, setRefreshing] = React.useState(false);

  const heroSubtitle = useMemo(() => {
    if (loading) {
      return 'Bootstrapping libp2p transport and spinning up OrbitDB…';
    }
    if (isOnline) {
      if (connectedPeers > 0) {
        return `Connected to ${connectedPeers} peer${connectedPeers === 1 ? '' : 's'} with live replication.`;
      }
      return 'Online and awaiting peer discovery.';
    }
    return 'Node is offline. Check connectivity and try again.';
  }, [loading, isOnline, connectedPeers]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshStorageUsage(), ensurePinService()]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    Promise.all([refreshStorageUsage(), ensurePinService()]).catch(() => {});
  }, [refreshStorageUsage, ensurePinService]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.highlight} />}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle}>Orbit node</Text>
            <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
          </View>
          <StatusBadge online={isOnline} loading={loading} />
        </View>

        <View style={styles.heroMetaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Pin service</Text>
            <Text style={[styles.metaValue, { color: pinServiceRunning ? palette.success : palette.warning }]}>
              {pinServiceRunning ? 'Active' : 'Starting'}
            </Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Storage</Text>
            <Text style={styles.metaValue}>{formatBytes(storageUsedBytes)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh metrics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <StatCard label="Connected peers" value={connectedPeers} hint="Active libp2p sessions" />
        <StatCard label="Discovered peers" value={discoveredPeers} hint="Peers seen this session" />
        <StatCard label="Pin service" value={pinServiceRunning ? 'Running' : 'Stopped'} hint="Background replication" />
        <StatCard label="Storage used" value={formatBytes(storageUsedBytes)} hint="Helia blockstore footprint" />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Node insight</Text>
        <Text style={styles.infoText}>
          CyberFly leverages OrbitDB on top of Helia and libp2p to enable sovereign data replication. Keep the app
          foregrounded for best connectivity, or configure a relay peer for resilient uptime.
        </Text>
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
  heroCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroTitle: {
    color: palette.textPrimary,
    fontSize: typography.heading1,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: palette.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.xs,
    flexShrink: 1,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaPill: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  metaLabel: {
    color: palette.textMuted,
    fontSize: typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaValue: {
    color: palette.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  refreshButton: {
    alignSelf: 'flex-start',
    backgroundColor: palette.highlight,
    borderRadius: radii.md,
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.lg,
  },
  refreshButtonText: {
    color: '#021225',
    fontWeight: '700',
    fontSize: typography.small,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  statLabel: {
    color: palette.textMuted,
    fontSize: typography.small,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  statValue: {
    color: palette.textPrimary,
    fontSize: typography.heading2,
    fontWeight: '700',
  },
  statHint: {
    color: palette.textSecondary,
    fontSize: typography.tiny,
    marginTop: spacing.xs,
  },
  infoCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  infoTitle: {
    color: palette.textPrimary,
    fontSize: typography.heading2,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  infoText: {
    color: palette.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexShrink: 0,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusBadgeText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
});

export default DashboardScreen;
