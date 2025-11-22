import React, { useState, useEffect, ComponentProps } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Category } from '@/types/category';
import { Account } from '@/types/account';
import { createTransaction } from '@/services/TransactionsService';
import { getAccounts } from '@/services/AccountsService';

const COLORS = {
  background: '#fff',
  card: '#1E1E1E',
  text: '#1f1f1f',
  TextInput: '#f5f5f5',
  textSecondary: '#A9A9A9',
  income: '#61c58bff',
  expense: '#e56d5fff',
  primary: 'black',
  overlay: 'rgba(0,0,0,0.5)',
};

export default function AddTransactionModal() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Contas
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);

  // --- Recuperar dados ao voltar da seleção de categoria ---
  useEffect(() => {
    if (params.selectedCategoryId) {
      setSelectedCategory({
        id: parseInt(params.selectedCategoryId as string),
        name: params.selectedCategoryName as string,
        icon: params.selectedCategoryIcon as ComponentProps<typeof FontAwesome>['name'],
        color: params.selectedCategoryColor as string,
        type: params.type as 'EXPENSE' | 'INCOME' || type,
      });
    }

    if (params.restoredAmount) setAmount(params.restoredAmount as string);
    if (params.restoredDescription) setDescription(params.restoredDescription as string);
    if (params.type) setType(params.type as 'EXPENSE' | 'INCOME');

  }, [params.selectedCategoryId, params.restoredAmount, params.restoredDescription, params.type]);

  // Carregar Contas
  useEffect(() => {
    const loadData = async () => {
        try {
            const data = await getAccounts();
            setAccounts(data);
            
            if (params.restoredAccountId) {
                const restored = data.find(a => a.id.toString() === params.restoredAccountId);
                if (restored) setSelectedAccount(restored);
                else if (data.length > 0) setSelectedAccount(data[0]);
            } 
            else if (data.length > 0 && !selectedAccount) {
                setSelectedAccount(data[0]);
            }
        } catch (e) {
            console.error(e);
        }
    };
    loadData();
  }, [params.restoredAccountId]); 

  const handleSelectCategory = () => {
    router.push({
        pathname: '/select-category',
        params: {
            type: type,
            currentAmount: amount,
            currentDescription: description,
            currentAccountId: selectedAccount ? selectedAccount.id.toString() : ''
        }
    });
  };

  const handleTypeChange = (newType: 'EXPENSE' | 'INCOME') => {
    setType(newType);
    setSelectedCategory(null);
  };

  const handleSave = async () => {
    if (!amount || !description || !selectedCategory || !selectedAccount) {
      Alert.alert('Campos Incompletos', `Preencha: \n${!amount ? '- Valor\n' : ''}${!description ? '- Descrição\n' : ''}${!selectedCategory ? '- Categoria\n' : ''}`);
      return;
    }

    const valorNumerico = parseFloat(amount.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Valor Inválido', 'Insira um valor maior que zero.');
      return;
    }

    setIsLoading(true);
    try {
      await createTransaction({
        description,
        amount: valorNumerico,
        date: new Date().toISOString(),
        type,
        accountId: selectedAccount.id,
        categoryId: selectedCategory.id,
      });

      // --- CORREÇÃO FINAL AQUI ---
      // Usamos replace('/') para garantir que ele volte para a raiz do app (Home),
      // ignorando se havia telas de categoria abertas no histórico.
      router.replace('/'); 

    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar transação.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity 
      style={styles.modalItem} 
      onPress={() => {
        setSelectedAccount(item);
        setAccountModalVisible(false);
      }}
    >
      <Text style={[styles.modalItemText, selectedAccount?.id === item.id && styles.modalItemTextSelected]}>
        {item.name}
      </Text>
      {selectedAccount?.id === item.id && <FontAwesome name="check" size={16} color={COLORS.primary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* SELETOR DE TIPO */}
        <View style={styles.segmentControl}>
          <TouchableOpacity 
            style={[styles.segmentButtonIncome, type === 'INCOME' && styles.segmentButtonActiveIncome]}
            onPress={() => handleTypeChange('INCOME')}>
            <Text style={[styles.segmentText, type === 'INCOME' && styles.segmentTextActive]}>Receita</Text>
          </TouchableOpacity>          
          <TouchableOpacity 
            style={[styles.segmentButtonExpense, type === 'EXPENSE' && styles.segmentButtonActiveExpense]}
            onPress={() => handleTypeChange('EXPENSE')}>
            <Text style={[styles.segmentText, type === 'EXPENSE' && styles.segmentTextActive]}>Despesa</Text>
          </TouchableOpacity>
        </View>

        {/* INPUT VALOR */}
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

        {/* INPUT DESCRIÇÃO */}
        <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor={COLORS.textSecondary}
            value={description}
            onChangeText={setDescription}
        />

        {/* BOTÃO CATEGORIA */}
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

         {/* BOTÃO CONTA */}
         <TouchableOpacity style={styles.selectorButton} onPress={() => setAccountModalVisible(true)}>
            {selectedAccount ? (
               <Text style={styles.selectorText}>{selectedAccount.name}</Text>
            ) : (
               <Text style={styles.selectorTextPlaceholder}>Selecionar Conta</Text>
            )}
            <FontAwesome name="chevron-down" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} onPress={handleSave} disabled={isLoading}>
            <Text style={styles.saveButtonText}>{isLoading ? 'Salvando...' : 'Salvar Transação'}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isAccountModalVisible} transparent={true} animationType="fade" onRequestClose={() => setAccountModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setAccountModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Conta</Text>
            <FlatList data={accounts} keyExtractor={(item) => item.id.toString()} renderItem={renderAccountItem} style={{ maxHeight: 300 }} />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAccountModalVisible(false)}>
               <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background }, 
    content: { padding: 20, flexGrow: 1 },
    segmentControl: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 8, marginBottom: 24 },
    segmentButtonExpense: { flex: 1, padding: 14, borderTopRightRadius: 8, borderBottomRightRadius: 8, alignItems: 'center' },
    segmentButtonIncome: { flex: 1, padding: 14, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, alignItems: 'center' },
    segmentButtonActiveExpense: { backgroundColor: COLORS.expense },
    segmentButtonActiveIncome: { backgroundColor: COLORS.income },
    segmentText: { color: COLORS.textSecondary, fontFamily: 'Montserrat-Bold' },
    segmentTextActive: { color: COLORS.text },
    amountContainer: { alignItems: 'center', marginBottom: 24 },
    currencySymbol: { color: COLORS.text, fontSize: 24, fontFamily: 'Montserrat-Regular' },
    amountInput: { color: COLORS.text, fontSize: 64, fontFamily: 'Montserrat-Bold', textAlign: 'center', width: '100%' },
    input: { backgroundColor: COLORS.card, color: COLORS.TextInput, padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 16, fontFamily: 'Montserrat-Regular' },
    selectorButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 16, borderRadius: 8, marginBottom: 16 },
    selectorText: { color: COLORS.text, fontSize: 16, fontFamily: 'Montserrat-Regular' },
    selectorTextPlaceholder: { color: COLORS.textSecondary, fontSize: 16, fontFamily: 'Montserrat-Regular' },
    categorySelected: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    footer: { padding: 20},
    saveButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    saveButtonDisabled: { backgroundColor: 'gray', padding: 16, borderRadius: 8, alignItems: 'center' },
    saveButtonText: { color: COLORS.background, fontSize: 18, fontFamily: 'Montserrat-Bold' },
    modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: COLORS.background, borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 },
    modalTitle: { fontSize: 18, fontFamily: 'Montserrat-Bold', marginBottom: 16, textAlign: 'center', color: COLORS.text },
    modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    modalItemText: { fontSize: 16, fontFamily: 'Montserrat-Regular', color: COLORS.text },
    modalItemTextSelected: { fontFamily: 'Montserrat-Bold', color: COLORS.primary },
    modalCloseButton: { marginTop: 16, padding: 12, alignItems: 'center' },
    modalCloseButtonText: { color: COLORS.textSecondary, fontFamily: 'Montserrat-Bold' }
});