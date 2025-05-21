import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Clock, ChartBar as BarChart3, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  // Color configurations
  const tabBarActiveTintColor = colorScheme === 'dark' ? '#22d3ee' : '#0891b2';
  const tabBarInactiveTintColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b';
  const tabBarStyle = {
    backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
    borderTopColor: colorScheme === 'dark' ? '#334155' : '#e2e8f0',
  };

  // If not authenticated, this layout won't render
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle,
        tabBarShowLabel: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}