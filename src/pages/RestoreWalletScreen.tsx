import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import * as bip39 from 'bip39';
import { palette, spacing, radii, typography } from '../styles/theme';

type Props = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const RestoreWalletScreen: React.FC<Props> = ({ navigation }) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async () => {
    if (!seedPhrase.trim() || !password) {
      setError('Enter your seed phrase and choose a new password.');
      return;
    }

    if (!bip39.validateMnemonic(seedPhrase.trim())) {
      setError('Seed phrase is invalid. Please double-check each word.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual wallet restoration flow
      navigation.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Restore wallet</Text>
          </View>
          <Text style={styles.title}>Recover your identity.</Text>
          <Text style={styles.subtitle}>
            Paste your 12-word secret recovery phrase and set a fresh password to unlock your vault.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Seed phrase</Text>
          <TextInput
            style={[styles.input, styles.seedInput]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Enter your 12-word seed phrase"
            placeholderTextColor={palette.textMuted}
            value={seedPhrase}
            onChangeText={setSeedPhrase}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.sectionTitle}>New password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a new password"
            placeholderTextColor={palette.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            disabled={loading}
            onPress={handleRestore}
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Restoring…' : 'Restore wallet'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: palette.highlight,
    fontWeight: '600',
    fontSize: typography.small,
  },
  title: {
    fontSize: typography.heading1,
    color: palette.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontWeight: '600',
    fontSize: typography.heading3,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: palette.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.md,
  },
  seedInput: {
    minHeight: 120,
  },
  errorText: {
    color: palette.danger,
    fontSize: typography.small,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: palette.highlight,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#021225',
    fontWeight: '700',
    fontSize: typography.body,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
