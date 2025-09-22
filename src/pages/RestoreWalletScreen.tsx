import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, Text } from 'react-native';
import { Button, Card, Form, Input, Toast } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as bip39 from 'bip39';
import { styles } from '../styles/onboarding.styles';
import { material } from 'react-native-typography'

export const RestoreWalletScreen = ({ navigation }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
  
    const handleRestore = async () => {
      try {
        setLoading(true);
        const values = await form.validateFields();
        
        // Validate seed phrase
        if (!bip39.validateMnemonic(values.seedPhrase)) {
          Toast.fail('Invalid seed phrase');
          return;
        }
  
        // TODO: Implement wallet restoration logic here
        
        Toast.success('Wallet restored successfully');
        navigation.navigate('Login');
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
            <Text style={material.display1}>
              Restore Wallet
            </Text>
  
            <Form form={form}>
              <Form.Item
                name="seedPhrase"
                rules={[
                  { required: true, message: 'Please enter your seed phrase' }
                ]}
              >
                <Input.TextArea
                  placeholder="Enter your 12-word seed phrase"
                  rows={4}
                  style={styles.textArea}
                />
              </Form.Item>
  
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 8, message: 'Password must be at least 8 characters' }
                ]}
              >
                <Input
                  placeholder="New Password"
                  type="password"
                  leftIcon={<Icon name="lock" size={24} color="#666" />}
                  style={styles.input}
                />
              </Form.Item>
  
              <Button
                type="primary"
                onPress={handleRestore}
                loading={loading}
                style={styles.button}
              >
                Restore Wallet
              </Button>
            </Form>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };