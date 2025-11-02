import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {/* Aba 1: Faturas (Contas a Pagar) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Faturas', // <-- CORREÇÃO APLICADA AQUI
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list-alt" color={color} />,
        }}
      />

      {/* Aba 2: Botão Central de Adicionar */}
      <Tabs.Screen
        name="add-placeholder"
        options={{
          title: 'Adicionar',
          tabBarIcon: ({ color }) => <FontAwesome size={34} name="plus-circle" color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); 
            router.push('/add-bill'); // Esta parte já estava correta!
          },
        }}
      />
      
      {/* Aba 3: Transações */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transações',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="exchange" color={color} />,
        }}
      />
    </Tabs>
  );
}