import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { useDatabase } from '../context/DatabaseContext';

const QueryDatabaseScreen = () => {
  const { orbitdb, loading } = useDatabase();
  const [dbAddress, setDbAddress] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadDatabase = async () => {
    if (!dbAddress.trim()) {
      Alert.alert('Error', 'Please enter a database address');
      return;
    }

    if (!orbitdb) {
      Alert.alert('Error', 'OrbitDB not initialized');
      return;
    }

    try {
      setIsQuerying(true);
      setError(null);
      setQueryResult(null);

      // Open the database
      const db = await orbitdb.open(dbAddress.trim());
      
      // Load the database content
      await db.load();

      // Get all entries based on database type
      let result;
      if (db.type === 'documents') {
        result = await db.query();
      } else if (db.type === 'keyvalue') {
        result = db.all();
      } else if (db.type === 'events') {
        result = db.iterator({ limit: 100 }).collect();
      } else {
        result = { type: db.type, address: db.address, info: 'Database opened successfully' };
      }

      setQueryResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load database';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleClearResults = () => {
    setQueryResult(null);
    setError(null);
  };

  const isDisabled = loading || isQuerying || !dbAddress.trim();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Query Database</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Database Address</Text>
        <TextInput
          style={styles.input}
          value={dbAddress}
          onChangeText={setDbAddress}
          placeholder="Enter OrbitDB address..."
          placeholderTextColor="rgba(148, 163, 184, 0.6)"
          autoCapitalize="none"
          autoCorrect={false}
          multiline={true}
          numberOfLines={3}
        />
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.queryButton,
            isDisabled && styles.buttonDisabled,
            pressed && !isDisabled && styles.pressed,
          ]}
          onPress={handleLoadDatabase}
          disabled={isDisabled}
        >
          <Text style={[styles.queryButtonText, isDisabled && styles.buttonTextDisabled]}>
            {isQuerying ? 'Loading...' : 'Load Database'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.pressed,
          ]}
          onPress={handleClearResults}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorSection}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {queryResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Query Results</Text>
          <ScrollView style={styles.jsonContainer} horizontal>
            <Text style={styles.jsonText} selectable>
              {JSON.stringify(queryResult, null, 2)}
            </Text>
          </ScrollView>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Usage Instructions</Text>
        <Text style={styles.infoText}>
          1. Enter a valid OrbitDB address{'\n'}
          2. Tap "Load Database" to open and query the database{'\n'}
          3. View the results in the JSON output below{'\n'}
          4. Use "Clear" to reset the results
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#e2e8f0',
    backgroundColor: 'rgba(255,255,255,0.05)',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  queryButton: {
    flex: 1,
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  queryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#081018',
  },
  clearButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(14, 165, 233, 0.3)',
  },
  buttonTextDisabled: {
    color: 'rgba(8, 16, 24, 0.5)',
  },
  errorSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f87171',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#fca5a5',
  },
  resultSection: {
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  jsonContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    maxHeight: 300,
    padding: 16,
  },
  jsonText: {
    fontSize: 12,
    color: '#e2e8f0',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  infoSection: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default QueryDatabaseScreen;
