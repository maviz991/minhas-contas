import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getCategories } from '@/services/CategoriesService';
import { Category } from '@/types/category';

const COLORS = {
  background: '#fff',
  card: '#f5f5f5', 
  text: '#1f1f1f',
  textSecondary: '#A9A9A9',
  primary: 'black',
};

export default function SelectCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Recebe os dados da tela anterior para não perdê-los
  const currentType = (params.type as 'INCOME' | 'EXPENSE') || 'EXPENSE';
  const currentAmount = params.currentAmount as string || '';
  const currentDescription = params.currentDescription as string || '';
  const currentAccountId = params.currentAccountId as string || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories(currentType);
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [currentType]);

  const handleSelectCategory = (category: Category) => {
    // DEVOLVE TUDO PARA A TELA ANTERIOR
    router.navigate({
      pathname: '/add-transaction',
      params: { 
        // Dados novos
        selectedCategoryId: category.id, 
        selectedCategoryName: category.name,
        selectedCategoryIcon: category.icon,
        selectedCategoryColor: category.color,
        
        // Dados antigos restaurados (renomeamos para ficar claro)
        restoredAmount: currentAmount,
        restoredDescription: currentDescription,
        restoredAccountId: currentAccountId,
        type: currentType
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecione uma Categoria</Text>
        <View style={{width: 24}} />
      </View>
      
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelectCategory(item)}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <FontAwesome name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                 <FontAwesome name="chevron-right" size={14} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
    
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    backButton: { padding: 4 },
    headerTitle: { color: COLORS.text, fontSize: 18, fontFamily: 'Montserrat-Bold' },
    item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    itemName: { color: COLORS.text, fontSize: 16, fontFamily: 'Montserrat-Regular' },
});
