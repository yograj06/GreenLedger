// Core data model types for GreenLedger Odisha

export type UserRole = 'farmer' | 'transporter' | 'retailer' | 'consumer' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  district: string;
  trustScore: number;
  phone?: string;
  email?: string;
  createdAt: number;
  totalTransactions: number;
  successfulDeliveries: number;
}

export type CropType = 'paddy' | 'turmeric' | 'brinjal' | 'chili' | 'groundnut' | 'sesame' | 'maize' | 'coconut' | 'cashew';
export type ProductStatus = 'registered' | 'pickup_scheduled' | 'in_transit' | 'delivered' | 'verified' | 'expired';

export interface Product {
  id: string;
  name: string;
  category: CropType;
  variety?: string;
  unit: 'kg' | 'quintal' | 'tonnes';
  quantity: number;
  farmerId: string;
  district: string;
  harvestDate: number;
  expiryDate: number;
  status: ProductStatus;
  qrCodeId: string;
  blockchainTx?: string;
  description?: string;
  organicCertified?: boolean;
  pricePerUnit?: number;
  createdAt: number;
}

export type ShipmentStatus = 'pending' | 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export interface Shipment {
  id: string;
  productIds: string[];
  transporterId?: string;
  originDistrict: string;
  destinationDistrict: string;
  status: ShipmentStatus;
  createdAt: number;
  scheduledPickup?: number;
  actualPickup?: number;
  estimatedDelivery?: number;
  actualDelivery?: number;
  events: Event[];
  temperature?: number;
  humidity?: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export type EventType = 'registration' | 'pickup_scheduled' | 'picked_up' | 'status_update' | 'temperature_log' | 'delivered' | 'verified';

export interface Event {
  id: string;
  productId?: string;
  shipmentId?: string;
  actorRole: UserRole;
  actorId: string;
  type: EventType;
  timestamp: number;
  location?: string;
  temperature?: number;
  humidity?: number;
  blockchainTx?: string;
  notes?: string;
}

export interface Rating {
  id: string;
  targetId: string; // ID of user being rated
  targetRole: UserRole;
  fromId: string; // ID of user giving rating
  fromRole: UserRole;
  stars: number; // 1-5
  comment?: string;
  createdAt: number;
  productId?: string;
  shipmentId?: string;
}

export type PaymentState = 'escrowed' | 'released' | 'refunded' | 'disputed';

export interface Payment {
  id: string;
  payerId: string;
  payeeId: string;
  productId?: string;
  shipmentId?: string;
  amount: number;
  state: PaymentState;
  blockchainTx?: string;
  createdAt: number;
  releasedAt?: number;
  escrowReleaseCondition: 'delivery_confirmed' | 'quality_verified' | 'manual_release';
  currency: 'INR';
}

// App State Types
export interface AppState {
  currentUser: UserProfile | null;
  users: UserProfile[];
  products: Product[];
  shipments: Shipment[];
  events: Event[];
  ratings: Rating[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

export type AppAction = 
  | { type: 'SET_CURRENT_USER'; payload: UserProfile | null }
  | { type: 'ADD_USER'; payload: UserProfile }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<UserProfile> } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'ADD_SHIPMENT'; payload: Shipment }
  | { type: 'UPDATE_SHIPMENT'; payload: { id: string; updates: Partial<Shipment> } }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'ADD_RATING'; payload: Rating }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; updates: Partial<Payment> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_DEMO_DATA' }
  | { type: 'LOAD_STATE'; payload: AppState };

// UI State Types
export interface QRModalState {
  isOpen: boolean;
  product: Product | null;
  qrDataUrl: string | null;
}

export interface PaymentModalState {
  isOpen: boolean;
  payment: Payment | null;
}

// Analytics Types
export interface DistrictAnalytics {
  district: string;
  totalProducts: number;
  totalShipments: number;
  averageTrustScore: number;
  deliverySuccessRate: number;
  popularCrops: { crop: CropType; count: number }[];
}

export interface TrustScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}