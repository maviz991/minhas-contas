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