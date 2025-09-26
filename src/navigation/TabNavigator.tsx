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
const TabIcon = ({ name, color, size = 20 }: { name: string; color: string; size?: number }) => (
  <Text style={[styles.iconText, { color, fontSize: size }]}>{name}</Text>
);

// Define icon components outside render
const DashboardIcon = ({ color, size }: { color: string; size?: number }) => (
  <TabIcon name="📊" color={color} size={size}
  />
);
const OpenIcon = ({ color, size }: { color: string; size?: number }) => <TabIcon name="📂" color={color} size={size} />;
const SettingsIcon = ({ color, size }: { color: string; size?: number }) => <TabIcon name="⚙️" color={color} size={size} />;

const styles = StyleSheet.create({
  iconText: {
    fontSize: 20,
  },
});

// Tab icon renderers (stable references for linter compliance)
const renderDashboardIcon = ({ color, size }: { color: string; size: number }) => (
  <DashboardIcon color={color} size={size} />
);
const renderOpenIcon = ({ color, size }: { color: string; size: number }) => (
  <OpenIcon color={color} size={size} />
);
const renderSettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <SettingsIcon color={color} size={size} />
);

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
          tabBarIcon: renderDashboardIcon,
          headerTitle: 'Node Dashboard',
        }}
      />
        <Tab.Screen
          name="Open"
          component={OpenDatabaseScreen}
          options={{
            tabBarIcon: renderOpenIcon,
            headerTitle: 'Open Database',
          }}
        />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: renderSettingsIcon,
          headerTitle: 'Settings & Status',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
