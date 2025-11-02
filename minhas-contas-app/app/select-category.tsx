import React, { useState, useEffect, ComponentProps } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getCategories } from '@/services/CategoriesService';
import { Category } from '@/types/category';

const COLORS = {
  background: '#101010',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A9A9A9',
  primary: '#13ec5b',
};

export default function SelectCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const transactionType = params.type as 'INCOME' | 'EXPENSE';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!transactionType) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories(transactionType);
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [transactionType]);

  const handleSelectCategory = (category: Category) => {
    router.setParams({ 
      selectedCategoryId: category.id.toString(), 
      selectedCategoryName: category.name,
      selectedCategoryIcon: category.icon,
      selectedCategoryColor: category.color,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
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
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelectCategory(item)}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <FontAwesome name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
    
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.card },
    headerTitle: { color: COLORS.text, fontSize: 20, fontFamily: 'Manrope-Bold' },
    item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.card },
    iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    itemName: { color: COLORS.text, fontSize: 16, fontFamily: 'Manrope-Regular' },
});