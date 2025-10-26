import React from 'react';
import { Tabs, useRouter } from 'expo-router'; // 1. Adicione useRouter aqui
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter(); // 2. Crie uma instância do router aqui

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {/* Aba 1: Contas */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Contas',
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
            // Previne a navegação padrão
            e.preventDefault(); 
            // 3. TROQUE O ALERT POR ESTA LINHA:
            router.push('/add-account'); 
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