import React from 'react';
import { View } from 'react-native';
import { Card, Modal, Typography } from '@ant-design/react-native';
import { styles } from '../styles/onboarding.styles';

export const SeedPhraseModal = ({ visible, seedPhrase, onClose, onComplete }) => {
  return (
    <Modal
      visible={visible}
      transparent={false}
      onClose={onClose}
      title="Backup Seed Phrase"
      footer={[
        { text: 'I have saved it', onPress: onComplete },
      ]}
    >
      <View style={styles.seedPhraseContainer}>
        <Typography.Text style={styles.warningText}>
          Write down these 12 words in order and keep them safe. You'll need them to restore your wallet.
        </Typography.Text>
        <Card style={styles.seedPhraseCard}>
          <Typography.Text style={styles.seedPhrase}>
            {seedPhrase}
          </Typography.Text>
        </Card>
      </View>
    </Modal>
  );
};