import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import { getAccounts, deleteAccount } from '../../services/AccountsService';
import { Account } from '../../types/account';
import { Ionicons } from '@expo/vector-icons';

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError('Não foi possível carregar as contas.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  const handleDeleteAccount = async (id: number) => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir esta conta? Todas as transações associadas serão perdidas.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await deleteAccount(id);
              fetchAccounts(); // Recarrega a lista de contas
            } catch (err) {
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Account }) => (
    <Link href={{ pathname: "/add-account", params: { id: item.id, name: item.name, balance: item.balance } }} asChild>
      <TouchableOpacity style={styles.itemContainer}>
        <View>
          <Text style={styles.itemNome}>{item.name}</Text>
          <Text style={styles.itemSaldo}>
            R$ {item.balance.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteAccount(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Minhas Contas</Text>
            <Link href="/add-account" asChild>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={30} color="#007AFF" />
              </TouchableOpacity>
            </Link>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 5,
  },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSaldo: {
    fontSize: 18,
    color: 'green',
  },
  deleteButton: {
    padding: 8,
  },
});