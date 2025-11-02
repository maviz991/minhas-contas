import React, { useState, useEffect, ComponentProps } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Category } from '@/types/category';
import { createTransaction } from '@/services/TransactionsService';

const COLORS = {
  background: '#101010',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A9A9A9',
  income: '#2ECC71',
  expense: '#E74C3C',
  primary: '#3498DB',
};

export default function AddTransactionModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.selectedCategoryId) {
      setSelectedCategory({
        id: parseInt(params.selectedCategoryId as string),
        name: params.selectedCategoryName as string,
        icon: params.selectedCategoryIcon as ComponentProps<typeof FontAwesome>['name'],
        color: params.selectedCategoryColor as string,
        type: type,
      });
    }
  }, [params.selectedCategoryId]);

  const handleSelectCategory = () => {
    router.push(`/select-category?type=${type}`);
  };

  const handleTypeChange = (newType: 'EXPENSE' | 'INCOME') => {
    setType(newType);
    setSelectedCategory(null);
  };

  const handleSave = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha o valor, a descrição e selecione uma categoria.');
      return;
    }

    const valorNumerico = parseFloat(amount.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Valor Inválido', 'Por favor, insira um valor numérico maior que zero.');
      return;
    }

    // Para simplificar, estamos hardcoding a conta e a data.
    // Em uma versão futura, teríamos seletores para ambos.
    const transactionData = {
      description,
      amount: valorNumerico,
      date: new Date().toISOString(),
      type,
      accountId: 1, // ATENÇÃO: Garanta que uma conta com id=1 exista!
      categoryId: selectedCategory.id,
    };

    setIsLoading(true);
    try {
      await createTransaction(transactionData);
      // O useFocusEffect no dashboard irá recarregar a lista.
      router.back();
    } catch (error) {
      console.error('Falha ao salvar transação:', error);
      Alert.alert('Erro', 'Não foi possível salvar a transação. Verifique o console do backend para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nova Transação</Text>
            <View style={{width: 24}} />
        </View>

        <View style={styles.segmentControl}>
          <TouchableOpacity 
            style={[styles.segmentButton, type === 'EXPENSE' && styles.segmentButtonActiveExpense]}
            onPress={() => handleTypeChange('EXPENSE')}>
            <Text style={[styles.segmentText, type === 'EXPENSE' && styles.segmentTextActive]}>Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segmentButton, type === 'INCOME' && styles.segmentButtonActiveIncome]}
            onPress={() => handleTypeChange('INCOME')}>
            <Text style={[styles.segmentText, type === 'INCOME' && styles.segmentTextActive]}>Receita</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>R$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0,00"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor={COLORS.textSecondary}
            value={description}
            onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.selectorButton} onPress={handleSelectCategory}>
            {selectedCategory ? (
            <View style={styles.categorySelected}>
                <View style={[styles.iconContainer, { backgroundColor: selectedCategory.color + '20' }]}>
                <FontAwesome name={selectedCategory.icon} size={18} color={selectedCategory.color} />
                </View>
                <Text style={styles.selectorText}>{selectedCategory.name}</Text>
            </View>
            ) : (
            <Text style={styles.selectorTextPlaceholder}>Categoria</Text>
            )}
            <FontAwesome name="chevron-down" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

         <TouchableOpacity style={styles.selectorButton}>
            <Text style={styles.selectorTextPlaceholder}>Conta (Padrão)</Text>
            <FontAwesome name="chevron-down" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isLoading}
        >
            <Text style={styles.saveButtonText}>{isLoading ? 'Salvando...' : 'Salvar Transação'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: 20, flexGrow: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    headerTitle: { color: COLORS.text, fontSize: 20, fontFamily: 'Manrope-Bold' },
    segmentControl: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 12, marginBottom: 24 },
    segmentButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
    segmentButtonActiveExpense: { backgroundColor: COLORS.expense },
    segmentButtonActiveIncome: { backgroundColor: COLORS.income },
    segmentText: { color: COLORS.textSecondary, fontFamily: 'Manrope-Bold' },
    segmentTextActive: { color: COLORS.text },
    amountContainer: { alignItems: 'center', marginBottom: 24 },
    currencySymbol: { color: COLORS.text, fontSize: 24, fontFamily: 'Manrope-Regular' },
    amountInput: { color: COLORS.text, fontSize: 64, fontFamily: 'Manrope-Bold', textAlign: 'center', width: '100%' },
    input: { backgroundColor: COLORS.card, color: COLORS.text, padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16, fontFamily: 'Manrope-Regular' },
    selectorButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 16, borderRadius: 12, marginBottom: 16 },
    selectorText: { color: COLORS.text, fontSize: 16, fontFamily: 'Manrope-Regular' },
    selectorTextPlaceholder: { color: COLORS.textSecondary, fontSize: 16, fontFamily: 'Manrope-Regular' },
    categorySelected: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.card },
    saveButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
    saveButtonDisabled: { backgroundColor: '#3498DB80' },
    saveButtonText: { color: COLORS.background, fontSize: 16, fontFamily: 'Manrope-Bold' },
});