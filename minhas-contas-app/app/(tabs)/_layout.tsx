import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Tabs, useRouter, Link } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const COLORS = {
  backgroundDark: '#fff',
  primary: '#111b21',
  inactive: '#808080ff',
};


export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundDark,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="home" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Faturas',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="list-alt" color={color} />,
        }}
      />

      <Tabs.Screen
        name="add-transaction"
          options={{
          title: 'Transação',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="list-alt" color={color} />, 
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/add-transaction'); 
          },
        }}
      />
      
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Contas',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="bank" color={color} />,
          headerRight: () => (
            <Link href="/add-account" asChild>
              <TouchableOpacity style={{ marginRight: 15 }}>
                <Ionicons name="add-circle-outline" size={30} color={COLORS.backgroundDark} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transações',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="exchange" color={color} />,
        }}
      />
    </Tabs>
  );
}