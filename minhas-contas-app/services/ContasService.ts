import api from './api';
import { Conta } from '../types/conta'; // Certifique-se que o arquivo types/conta.ts existe

// Tipo para os dados de criação, já que o 'id' não é necessário
type CreateContaData = Omit<Conta, 'id'>;

/**
 * Busca todas as contas a pagar da API.
 */
export const getContas = async (): Promise<Conta[]> => {
  try {
    const response = await api.get('/contas');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    throw error;
  }
};

/**
 * Cria uma nova conta a pagar na API.
 */
export const createConta = async (data: CreateContaData): Promise<Conta> => {
  try {
    const response = await api.post('/contas', data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    throw error;
  }
};