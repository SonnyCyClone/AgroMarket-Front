/**
 * Mock interface para el perfil de usuario - AgroMarket
 * 
 * @description Interface temporal para simular datos de perfil de usuario
 * hasta que se implementen los servicios reales
 */

export interface MockUserProfile {
  fullName: string;
  email: string;
  phone: string;
  addresses: Array<{
    label: string;
    line1: string;
    city: string;
    country: string;
  }>;
  cards: Array<{
    brand: 'Visa' | 'Mastercard' | 'Amex';
    last4: string;
    holder: string;
  }>;
}

export interface ProfileCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}