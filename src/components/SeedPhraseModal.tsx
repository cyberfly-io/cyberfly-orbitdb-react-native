import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { palette, spacing, radii, typography } from '../styles/theme';

type Props = {
  visible: boolean;
  seedPhrase: string;
  onClose: () => void;
  onComplete: () => void;
};

export const SeedPhraseModal: React.FC<Props> = ({ visible, seedPhrase, onClose, onComplete }) => {
  const words = useMemo(
    () => seedPhrase.trim().split(/\s+/).filter(Boolean),
    [seedPhrase],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Backup seed phrase</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.warning}>
            Write these words down in order and store them offline. Anyone with this phrase can access your wallet.
          </Text>

          <ScrollView contentContainerStyle={styles.wordsGrid}>
            {words.map((word, index) => (
              <View key={`${word}-${index}`} style={styles.wordChip}>
                <Text style={styles.wordIndex}>{index + 1}</Text>
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
            <Text style={styles.primaryButtonText}>I&apos;ve stored it safely</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.heading2,
    fontWeight: '700',
  },
  closeIcon: {
    color: palette.textSecondary,
    fontSize: typography.heading2,
  },
  warning: {
    color: palette.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: radii.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  wordIndex: {
    color: palette.highlight,
    fontWeight: '700',
    marginRight: spacing.xs,
    fontSize: typography.small,
  },
  wordText: {
    color: palette.textPrimary,
    fontSize: typography.small,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
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
});
