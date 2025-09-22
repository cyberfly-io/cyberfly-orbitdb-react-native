import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

const GetStartedScreen = ({ navigation }) => {
  const features = [
    {
      title: 'Secure Storage',
      description: 'Your private keys never leave your device',
      icon: '🔒'
    },
    {
      title: 'Multi-Currency',
      description: 'Support for multiple cryptocurrencies',
      icon: '💰'
    },
    {
      title: 'Easy Transactions',
      description: 'Send and receive crypto with just a few taps',
      icon: '↔️'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome to CryptoWallet</Text>
          <Text style={styles.subtitle}>
            Your secure gateway to the world of cryptocurrency
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('CreateWallet')}
          >
            <Text style={styles.buttonText}>Create New Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('ImportWallet')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Import Existing Wallet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginVertical: 30,
  },
  featureCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
  },
  actionContainer: {
    marginVertical: 20,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1a237e',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1a237e',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#1a237e',
  },
  terms: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GetStartedScreen;