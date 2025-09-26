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
import { SeedPhraseModal } from '../components/SeedPhraseModal';

type Props = {
  navigation: {
    navigate: (route: string) => void;
  };
};

export const CreateAccountScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const handleCreate = async () => {
    if (!fullName.trim() || !password || !confirmPassword) {
      setError('Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const mnemonic = bip39.generateMnemonic();
      setSeedPhrase(mnemonic);
      setShowSeedPhrase(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
            <Text style={styles.badgeText}>Create Wallet</Text>
          </View>
          <Text style={styles.title}>Set up a secure identity.</Text>
          <Text style={styles.subtitle}>
            We&apos;ll generate a seed phrase that unlocks your decentralized vault. Keep it offline and private.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile details</Text>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Display name</Text>
            <TextInput
              placeholder="e.g. Satoshi Nakamoto"
              placeholderTextColor={palette.textMuted}
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Create a strong password"
              placeholderTextColor={palette.textMuted}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              placeholder="Repeat password"
              placeholderTextColor={palette.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            disabled={loading}
            onPress={handleCreate}
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Creating wallet…' : 'Generate seed phrase'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SeedPhraseModal
        visible={showSeedPhrase}
        seedPhrase={seedPhrase}
        onClose={() => setShowSeedPhrase(false)}
        onComplete={() => {
          setShowSeedPhrase(false);
          navigation.navigate('Login');
        }}
      />
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
    marginTop: spacing.sm,
  },
  fieldBlock: {
    marginBottom: spacing.md,
  },
  label: {
    color: palette.textSecondary,
    fontSize: typography.small,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: palette.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: palette.border,
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
    marginTop: spacing.sm,
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
