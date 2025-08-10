export enum AccountType {
  CONTA_CORRENTE = 'conta_corrente',
  POUPANCA = 'poupanca',
  CARTAO_CREDITO = 'cartao_credito',
  DINHEIRO = 'dinheiro',
  INVESTIMENTO = 'investimento'
}

export interface Account {
  id: number;
  userId: number;
  name: string;
  type: AccountType;
  initialBalance: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}