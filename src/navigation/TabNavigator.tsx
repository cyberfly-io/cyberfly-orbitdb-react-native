import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform, StyleSheet } from 'react-native';

// Import screens
// import DatabaseListScreen from '../screens/DatabaseListScreen';
// import CreateDatabaseScreen from '../screens/CreateDatabaseScreen';
// import QueryDatabaseScreen from '../screens/QueryDatabaseScreen';
import DashboardScreen from '../screens/DashboardScreen';
import OpenDatabaseScreen from '../screens/OpenDatabaseScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Simple icon component since we don't have icon fonts set up yet
const TabIcon = ({ name, color }: { name: string; color: string }) => (
  <Text style={[styles.iconText, { color }]}>{name}</Text>
);

// Define icon components outside render
const DashboardIcon = ({ color }: { color: string }) => <TabIcon name="�" color={color} />;
const OpenIcon = ({ color }: { color: string }) => <TabIcon name="📂" color={color} />;
const SettingsIcon = ({ color }: { color: string }) => <TabIcon name="⚙️" color={color} />;

const styles = StyleSheet.create({
  iconText: {
    fontSize: 20,
  },
});

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0b1220',
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#0b1220',
          borderBottomColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: '#e2e8f0',
          fontWeight: '700',
        },
        headerTintColor: '#e2e8f0',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: DashboardIcon,
          headerTitle: 'Node Dashboard',
        }}
      />
        <Tab.Screen
          name="Open"
          component={OpenDatabaseScreen}
          options={{
            tabBarIcon: OpenIcon,
            headerTitle: 'Open Database',
          }}
        />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: SettingsIcon,
          headerTitle: 'Settings & Status',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
