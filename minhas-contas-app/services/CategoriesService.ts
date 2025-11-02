import api from './api';
import { Category } from '../types/category';

/**
 * Busca categorias da API, filtrando por tipo.
 * @param type O tipo de categoria a ser buscado ('INCOME' ou 'EXPENSE').
 */
export const getCategories = async (type: 'INCOME' | 'EXPENSE'): Promise<Category[]> => {
  try {
    // Adiciona o tipo como um parâmetro de query na URL (ex: /categories?type=INCOME)
    const response = await api.get(`/categories?type=${type}`);
    return response.data;
  } catch (error) {
    // Adiciona um log mais detalhado para ajudar a depurar
    console.error(`Erro ao buscar categorias do tipo ${type}:`, error);
    throw error;
  }
};

/**
 * Cria uma nova categoria.
 * Usado principalmente para o script de seed ou futuras telas de gerenciamento.
 */
export const createCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    try {
        const response = await api.post('/categories', data);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        throw error;
    }
};