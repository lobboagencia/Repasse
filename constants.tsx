
import { Vehicle, PlanType, User, Report } from './types';

export const INITIAL_USER: User = {
  id: '',
  name: '',
  email: '',
  dealership: '',
  plan: PlanType.FREE,
  reputation: 0,
  avatar: 'https://ui-avatars.com/api/?name=User&background=f97316&color=fff'
};

/**
 * Mock user data used as a fallback for components that require a user context,
 * specifically for demonstration purposes and listing creation within this B2B environment.
 */
export const MOCK_USER: User = {
  id: 'usr_mock_123',
  name: 'Lojista Exemplo',
  email: 'comercial@repasseja.com.br',
  dealership: 'RepasseJá Veículos',
  plan: PlanType.PRO,
  reputation: 4.8,
  avatar: 'https://ui-avatars.com/api/?name=RepasseJa&background=f97316&color=fff'
};

export const INITIAL_VEHICLES: Vehicle[] = [];
export const INITIAL_REPORTS: Report[] = [];
