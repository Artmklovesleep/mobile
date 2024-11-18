import { Tabs } from 'expo-router';
import React from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // const handleLogout = async () => {
  //   try {
  //     await AsyncStorage.removeItem('user_id'); // Очистить user_id
  //     router.push('/'); // Перенаправить на главную страницу
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //   }
  // };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="main"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'History',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Button title="Logout" onPress={handleLogout} color={Colors[colorScheme ?? 'light'].tint} />
      </View> */}
    </>
  );
}
