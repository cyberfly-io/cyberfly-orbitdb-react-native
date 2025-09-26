import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { palette, spacing, radii, typography } from '../styles/theme';

type Props = {
  navigation: {
    navigate: (route: string) => void;
  };
};

const GetStartedScreen: React.FC<Props> = ({ navigation }) => {
  const features = [
    {
      title: 'Secure Key Vault',
      description: 'Private keys sealed on-device with zero-knowledge storage.',
      icon: '�️',
    },
    {
      title: 'Peer-to-Peer Sync',
      description: 'OrbitDB replication with resilient libp2p networking.',
      icon: '🪐',
    },
    {
      title: 'Instant Recovery',
      description: 'Seed phrase backup with guided restore workflows.',
      icon: '✨',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CyberFly Orbit Wallet</Text>
          </View>
          <Text style={styles.title}>Own your data vault.</Text>
          <Text style={styles.subtitle}>
            Manage decentralized identities, sync across peers, and stay in full control of your assets.
          </Text>
        </View>

        <View style={styles.featureGrid}>
          {features.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={styles.featureIconBubble}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Let&apos;s get started</Text>
          <Text style={styles.ctaCopy}>
            Create a new wallet or import an existing identity. You&apos;ll be guided through secure key backup along the way.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CreateWallet')}
          >
            <Text style={styles.primaryButtonText}>Create new wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('ImportWallet')}
          >
            <Text style={styles.secondaryButtonText}>Import existing wallet</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          By continuing you confirm that you accept the Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
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
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: palette.highlight,
    fontSize: typography.small,
    fontWeight: '600',
  },
  title: {
    fontSize: typography.heading1,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    lineHeight: 22,
    color: palette.textSecondary,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
    marginBottom: spacing.lg,
  },
  featureCard: {
    width: '50%',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: typography.heading3,
    fontWeight: '600',
    color: palette.textPrimary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.small,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  ctaCard: {
    backgroundColor: palette.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  ctaTitle: {
    fontSize: typography.heading2,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: spacing.sm,
  },
  ctaCopy: {
    fontSize: typography.small,
    color: palette.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: palette.highlight,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    color: '#021225',
    fontWeight: '700',
    fontSize: typography.body,
    letterSpacing: 0.2,
  },
  secondaryButton: {
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.highlight,
  },
  secondaryButtonText: {
    color: palette.highlight,
    fontWeight: '600',
    fontSize: typography.body,
  },
  terms: {
    fontSize: typography.tiny,
    color: palette.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 16,
  },
});

export default GetStartedScreen;
