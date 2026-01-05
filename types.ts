
export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COUNTER = 'COUNTER'
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  version?: string;
  year: number;
  modelYear?: number;
  km: number;
  price: number;
  retailPrice: number;
  city: string;
  state?: string;
  images: string[];
  reportStatus: 'verified' | 'pending' | 'none';
  dealer: string;
  dealerId?: string;
  createdAt: string;
  fuel?: string;
  transmission?: string;
  color?: string;
  description?: string;
  features?: string[];
  fipeCode?: string;
}

export interface Report {
  id: string;
  plate: string;
  model: string;
  date: string;
  status: 'approved' | 'warning' | 'rejected';
  score: number;
}

export interface AsaasPayment {
  id: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  pixQrCode?: string;
  pixKey?: string;
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE';
  value: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  dealership: string;
  plan: PlanType;
  reputation: number;
  avatar?: string;
  asaasCustomerId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'proposal' | 'counter' | 'status' | 'system' | 'payment';
  link?: string;
}

export interface Proposal {
  id: string;
  vehicleId: string;
  senderId: string;
  receiverId: string;
  value: number;
  status: ProposalStatus;
  validUntil: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'proposal' | 'system';
  payload?: any; 
}

export interface Chat {
  id: string;
  participant: {
    id: string;
    name: string;
    dealership: string;
    avatar?: string;
  };
  vehicle: Vehicle;
  messages: Message[];
  lastMessage?: string;
  unreadCount: number;
  updatedAt: string;
}

export interface FipeBrand { nome: string; codigo: string; }
export interface FipeModel { nome: string; codigo: string; }
export interface FipeYear { nome: string; codigo: string; }
export interface FipePrice {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}
