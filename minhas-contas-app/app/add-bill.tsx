import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, SafeAreaView, Switch, Alert, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { createBill } from '../services/BillsService';

// MUDOU AQUI: O nome do componente para refletir o que ele faz
export default function AddBillModal() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState(''); // Formato YYYY-MM-DD
  const [pago, setPago] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // ... (a lógica de validação continua a mesma) ...
    if (!nome.trim() || !valor.trim() || !vencimento.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(vencimento)) {
        Alert.alert('Erro de Formato', 'Use o formato de data AAAA-MM-DD.');
        return;
    }
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico)) {
      Alert.alert('Erro de Valor', 'O valor inserido é inválido.');
      return;
    }

    setLoading(true);
    try {
      await createBill({
        nome,
        valor: valorNumerico,
        vencimento,
        pago,
      });
      
      if (router.canGoBack()) {
        router.back();
      }

    } catch (error) {
      // MUDOU AQUI: Mensagem de erro mais específica
      Alert.alert('Erro na API', 'Não foi possível cadastrar a fatura. Verifique o console para mais detalhes.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* MUDOU AQUI: Título da tela */}
      <Text style={styles.title}>Adicionar Nova Fatura</Text>
      
      {/* MUDOU AQUI: Label do campo */}
      <Text style={styles.label}>Nome da Fatura</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Fatura do Cartão"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 150,75"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data de Vencimento</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD"
        value={vencimento}
        onChangeText={setVencimento}
        maxLength={10}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Já está paga?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={pago ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={setPago}
          value={pago}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSave} 
        disabled={loading}
      >
        {/* MUDOU AQUI: Texto do botão */}
        <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Fatura'}</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
         <TouchableOpacity 
            style={[styles.button, styles.closeButton]} 
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
});