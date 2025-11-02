export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  type: 'INCOME' | 'EXPENSE';
  accountId: number;
  categoryId: number;
}