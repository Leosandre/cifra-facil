import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6c5ce7',
        tabBarInactiveTintColor: '#636e72',
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#2d2d44',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="(search)"
        options={{
          title: 'Busca',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name="(library)"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📚</Text>,
        }}
      />
    </Tabs>
  );
}
