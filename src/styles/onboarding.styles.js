import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 20,
    color: '#1890ff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  textArea: {
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  seedPhraseContainer: {
    padding: 20,
  },
  warningText: {
    color: '#ff4d4f',
    marginBottom: 20,
    textAlign: 'center',
  },
  seedPhraseCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
  },
  seedPhrase: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});