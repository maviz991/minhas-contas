// app/(tabs)/index.tsx

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';

// Importamos nosso serviço de API
import api from '../../services/api'; // Note os '../' para sair das pastas

// Definimos o "formato" de um objeto de Conta para o TypeScript
type Account = {
  id: string;
  name: string;
  balance: number;
};

export default function HomeScreen() {
  // O <Account[]> diz ao TypeScript que este estado será um array de Contas
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccounts() {
      try {
        // Dizemos ao axios que a resposta será um array de Contas
        const response = await api.get<Account[]>('/accounts');
        setAccounts(response.data);
      } catch (error) {
        console.error('Erro ao buscar contas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando contas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Contas</Text>

      {/* Usamos FlatList para uma melhor performance em listas */}
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.accountItem}>
            <Text style={styles.accountName}>{item.name}</Text>
            <Text>Saldo: R$ {item.balance.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50, // Adiciona espaço no topo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  accountItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});