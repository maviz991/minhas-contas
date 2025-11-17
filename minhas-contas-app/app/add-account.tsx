import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createAccount, updateAccount } from '../services/AccountsService';

export default function AddAccountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const isEditing = !!params.id;

  useEffect(() => {
    if (isEditing) {
      setName(params.name as string || '');
    }
  }, [isEditing, params]);

  const handleSaveAccount = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome da conta não pode ser vazio.');
      return;
    }

    try {
      if (isEditing) {
        await updateAccount(Number(params.id), { name });
        Alert.alert('Sucesso', 'Conta atualizada com sucesso!');
      } else {
        await createAccount({ name });
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a conta.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome da Conta"
        value={name}
        onChangeText={setName}
      />
      <Button title={isEditing ? 'Salvar Alterações' : 'Adicionar Conta'} onPress={handleSaveAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});