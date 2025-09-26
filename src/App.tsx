import '../globals.js';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAccessController } from '@orbitdb/core';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { DatabaseProvider } from './context/DatabaseContext';
import TabNavigator from './navigation/TabNavigator';
import CyberflyAccessController from './cyberfly-access-controller';

export default function App() {
  useAccessController(CyberflyAccessController);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <DatabaseProvider>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </DatabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
