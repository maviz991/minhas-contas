import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

const COLORS = {
  background: '#111813',
  card: '#1C2C22',
  text: '#FFFFFF',
  textSecondary: '#9db9a6',
  primary: '#13ec5b',
  accentRed: '#E74C3C',
};

type Transacao = {
  id: number;
  icon: ComponentProps<typeof FontAwesome>['name'];
  nome: string;
  valor: number;
  data: string;
};

const transacoesRecentes: Transacao[] = [
    { id: 1, icon: 'shopping-cart', nome: 'Supermercado do Mês', valor: -450.30, data: 'Hoje' },
    { id: 2, icon: 'money', nome: 'Salário', valor: 5000.00, data: 'Ontem' },
    { id: 3, icon: 'bolt', nome: 'Conta de Luz', valor: -180.55, data: '25 de Out' },
];

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerOla}>Olá, Maria</Text>
          </View>
          <FontAwesome name="cog" size={24} color={COLORS.textSecondary} />
        </View>

        <View style={styles.saldoCard}>
          <Text style={styles.saldoLabel}>Saldo Atual</Text>
          <Text style={styles.saldoValor}>R$ 7.593,50</Text>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, {backgroundColor: COLORS.primary + '30'}]}
            onPress={() => router.push('/add-transaction')}
          >
             <FontAwesome name="plus" size={16} color={COLORS.primary} />
            <Text style={[styles.actionButtonText, {color: COLORS.primary}]}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, {backgroundColor: COLORS.accentRed + '30'}]}
            onPress={() => router.push('/add-transaction')}
          >
            <FontAwesome name="minus" size={16} color={COLORS.accentRed} />
            <Text style={[styles.actionButtonText, {color: COLORS.accentRed}]}>Despesa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transacoesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
            <TouchableOpacity>
              <Text style={styles.verTudo}>Ver Tudo</Text>
            </TouchableOpacity>
          </View>
          {transacoesRecentes.map(item => (
            <View key={item.id} style={styles.transacaoItem}>
              <View style={styles.transacaoIcon}>
                <FontAwesome name={item.icon} size={20} color={COLORS.textSecondary} />
              </View>
              <View style={styles.transacaoInfo}>
                <Text style={styles.transacaoNome}>{item.nome}</Text>
                <Text style={styles.transacaoData}>{item.data}</Text>
              </View>
              <Text style={item.valor > 0 ? styles.valorReceita : styles.valorDespesa}>
                {item.valor > 0 ? '+' : ''} R$ {Math.abs(item.valor).toFixed(2).replace('.',',')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Constants.statusBarHeight, 
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerOla: {
    color: COLORS.text,
    fontSize: 24,
    fontFamily: 'Manrope-Bold',
  },
  saldoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  saldoLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: 'Manrope-Regular',
    marginBottom: 8,
  },
  saldoValor: {
    color: COLORS.text,
    fontSize: 36,
    fontFamily: 'Manrope-Bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: 'Manrope-Bold',
  },
  verTudo: {
    color: COLORS.primary,
    fontFamily: 'Manrope-Bold',
  },
  transacoesContainer: {},
  transacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  transacaoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#28392e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transacaoInfo: { flex: 1 },
  transacaoNome: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  transacaoData: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'Manrope-Regular',
  },
  valorReceita: {
    color: '#2ECC71',
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  valorDespesa: {
    color: '#E74C3C',
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
});