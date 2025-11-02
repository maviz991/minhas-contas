import React from 'react';
import { View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Paleta de cores baseada nos seus protótipos
const COLORS = {
  backgroundDark: '#1C2C22', // Fundo da TabBar
  primary: '#13ec5b',         // Verde principal (ativo)
  inactive: '#9db9a6',       // Cinza/Verde para ícones inativos
  white: '#FFFFFF',
};

// Componente customizado para o botão de Adicionar flutuante
const AddButtonIcon = () => (
  <View
    style={{
      backgroundColor: COLORS.primary,
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      // Sobe o botão em relação à barra
      transform: [{ translateY: -20 }],
      // Sombra para dar profundidade
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
          borderTopWidth: 0, // Remove a linha superior padrão
          height: 60,
          paddingBottom: 5,
        },
        // Esconde o header padrão, pois cada tela terá seu próprio header customizado
        headerShown: false, 
      }}
    >
      {/* Aba 1: Painel (nosso novo Dashboard) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="home" color={color} />,
        }}
      />
      
      {/* Aba 2: Faturas (antiga lista de contas a pagar) */}
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Faturas',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="list-alt" color={color} />,
        }}
      />

      {/* Botão Central de Adicionar */}
      <Tabs.Screen
        name="add-placeholder"
        options={{
          title: '', // Sem título visível
          tabBarIcon: () => <AddButtonIcon />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // No futuro, isso abrirá o modal "Nova Transação"
            // Por enquanto, mantemos o "Adicionar Fatura" para não quebrar a funcionalidade
            router.push('/add-bill'); 
          },
        }}
      />
      
      {/* Aba 4: Contas Financeiras */}
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Contas',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="bank" color={color} />,
        }}
      />

      {/* Aba 5: Transações (ainda é um placeholder) */}
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