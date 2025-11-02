import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Switch, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getBills, updateBillStatus } from '../../services/BillsService';
import { Bill } from '../../types/bill';

export default function HomeScreen() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = async () => {
    try {
      // Não mostra o loading em recarregamentos, apenas na primeira vez
      if (bills.length === 0) setLoading(true);
      const data = await getBills();
      setBills(data);
      setError(null);
    } catch (err) {
      setError('Não foi possível carregar as Faturas.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBills();
    }, [])
  );

  const handleStatusChange = async (item: Bill, index: number) => {
    const originalBills = [...bills];
    const newStatus = !item.pago;

    // --- Atualização Otimista (Passo 1: Mudar a UI imediatamente) ---
    const updatedBills = [...bills];
    updatedBills[index] = { ...item, pago: newStatus };
    setBills(updatedBills);

    try {
      // --- Atualização Otimista (Passo 2: Chamar a API em segundo plano) ---
      await updateBillStatus(item.id, newStatus);
      // Se a API funcionou, não precisamos fazer nada, a UI já está correta.
    } catch (apiError) {
      // --- Atualização Otimista (Passo 3: Reverter a UI em caso de erro) ---
      Alert.alert('Erro', 'Não foi possível atualizar o status da Faturas.');
      setBills(originalBills); // Volta ao estado original
    }
  };

  const renderItem = ({ item, index }: { item: Bill; index: number }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemVencimento}>Vencimento: {new Date(item.vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={item.pago ? styles.statusPago : styles.statusPendente}>
          {item.pago ? 'Pago' : 'Pendente'}
        </Text>
        {/* --- NOVO COMPONENTE SWITCH --- */}
        <Switch
          value={item.pago}
          onValueChange={() => handleStatusChange(item, index)}
          style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} // Deixa o switch um pouco menor
        />
      </View>
    </View>
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
        data={bills}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (seus estilos existentes para centered, container, errorText, etc.) ...
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemVencimento: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusPago: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'green',
  },
  statusPendente: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'orange',
  },
});