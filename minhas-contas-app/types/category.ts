import { ComponentProps } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export interface Category {
  id: number;
  name: string;
  // Garante que o 'icon' seja um nome de ícone válido do FontAwesome
  icon: ComponentProps<typeof FontAwesome>['name']; 
  color: string;
  type: 'INCOME' | 'EXPENSE';
}