import api from './api';
import { Account } from '../types/account';

/**
 * Busca todas as contas financeiras (carteiras, contas de banco) da API.
 */
export const getAccounts = async (): Promise<Account[]> => {
  try {
    const response = await api.get('/accounts');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar contas financeiras:", error);
    throw error;
  }
};

/**
 * Cria uma nova conta financeira.
 */
export const createAccount = async (account: Omit<Account, 'id' | 'balance'>): Promise<Account> => {
  try {
    const response = await api.post('/accounts', account);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar conta financeira:", error);
    throw error;
  }
};

/**
 * Atualiza uma conta financeira existente.
 */
export const updateAccount = async (id: number, account: Omit<Account, 'id' | 'balance'>): Promise<Account> => {
  try {
    const response = await api.put(`/accounts/${id}`, account);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar conta financeira:", error);
    throw error;
  }
};

/**
 * Exclui uma conta financeira.
 */
export const deleteAccount = async (id: number): Promise<void> => {
  try {
    await api.delete(`/accounts/${id}`);
  } catch (error) {
    console.error("Erro ao excluir conta financeira:", error);
    throw error;
  }
};