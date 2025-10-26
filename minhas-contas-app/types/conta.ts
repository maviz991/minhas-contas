export interface Conta {
  id: number;
  nome: string;
  valor: number;
  vencimento: string; // Esperamos o formato "YYYY-MM-DD" da API
  pago: boolean;
}