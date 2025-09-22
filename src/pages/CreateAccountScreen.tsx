import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, Platform } from 'react-native';
import {Card, Form,Toast } from '@ant-design/react-native';
import { material } from 'react-native-typography'
import * as bip39 from 'bip39';
import { styles } from '../styles/onboarding.styles';
import { SeedPhraseModal } from '../components/SeedPhraseModal';

export const CreateAccountScreen = ({ navigation }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const mnemonic = bip39.generateMnemonic();
      setSeedPhrase(mnemonic);
      setShowSeedPhrase(true);
    } catch (error) {
      Toast.fail('Please check your input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <Card style={styles.card}>
          <Text  style={material.display1}>
            Create New Wallet
          </Text>

          <Form form={form}>
            {/* Form items here */}
          </Form>
        </Card>

        <SeedPhraseModal
          visible={showSeedPhrase}
          seedPhrase={seedPhrase}
          onClose={() => setShowSeedPhrase(false)}
          onComplete={() => navigation.navigate('Login')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};