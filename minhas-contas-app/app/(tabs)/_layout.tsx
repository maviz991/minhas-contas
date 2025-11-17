import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Tabs, useRouter, Link } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const COLORS = {
  backgroundDark: '#fff',
  primary: '#111b21',
  inactive: '#9db9a6',
};

const AddButtonIcon = () => (
  <View
    style={{
      backgroundColor: COLORS.primary,
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateY: -20 }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
    }}
  >
    <FontAwesome name="plus" size={28} color={COLORS.backgroundDark} />
  </View>
);

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
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
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
        name="add-placeholder"
        options={{
          title: '',
          tabBarIcon: () => <AddButtonIcon />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // AQUI ESTÁ A MUDANÇA
            router.push('/add-transaction'); 
          },
        }}
      />
      
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Contas',
          headerShown: true,
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