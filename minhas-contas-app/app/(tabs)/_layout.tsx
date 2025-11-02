import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs /* ...screenOptions... */ >
      {/* Aba 1: Faturas (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{ title: 'Faturas', tabBarIcon: ({ color }) => <FontAwesome size={28} name="list-alt" color={color} /> }}
      />

      {/* --- NOVA ABA: CONTAS FINANCEIRAS --- */}
      <Tabs.Screen
        name="accounts" // Corresponde ao novo arquivo accounts.tsx
        options={{
          title: 'Contas',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bank" color={color} />,
        }}
      />
      
      {/* Aba Central: Adicionar */}
      <Tabs.Screen
        name="add-placeholder"
        options={{ title: 'Adicionar', tabBarIcon: ({ color }) => <FontAwesome size={34} name="plus-circle" color={color} /> }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); 
            // No futuro, este botão abrirá um menu: "Adicionar Fatura" ou "Adicionar Transação"
            router.push('/add-bill');
          },
        }}
      />
      
      {/* Aba 4: Transações */}
      <Tabs.Screen
        name="transactions"
        options={{ title: 'Transações', tabBarIcon: ({ color }) => <FontAwesome size={28} name="exchange" color={color} /> }}
      />
    </Tabs>
  );
}