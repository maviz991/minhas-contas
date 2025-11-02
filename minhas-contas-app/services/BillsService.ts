import api from './api';
import { Bill } from '../types/bill';

// Por convenção, nomes de tipo começam com letra maiúscula (PascalCase).
// Mudei de 'CreatebillData' para 'CreateBillData'.
type CreateBillData = Omit<Bill, 'id'>;

/**
 * Busca todas as faturas (contas a pagar) da API.
 */
export const getBills = async (): Promise<Bill[]> => {
  try {
    const response = await api.get('/bills');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar faturas:", error); // Mensagem ajustada
    throw error;
  }
};

/**
 * Cria uma nova fatura na API.
 */
// A função agora espera o tipo com 'B' maiúsculo.
export const createBill = async (data: CreateBillData): Promise<Bill> => {
  try {
    const response = await api.post('/bills', data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar fatura:", error); // Mensagem ajustada
    throw error;
  }
};

/**
 * Atualiza o status de 'pago' de uma fatura.
 */
export const updateBillStatus = async (id: number, pago: boolean): Promise<Bill> => {
  try {
    const response = await api.patch(`/bills/${id}`, { pago });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar status da fatura ${id}:`, error); // Mensagem ajustada
    throw error;
  }
};