// Demo store with React Context + Reducer for app state management

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, UserProfile, Product, Shipment, Event, Rating, Payment, UserRole, CropType } from '@/types';
import StorageService from '@/services/storage';
// We'll generate IDs manually for demo purposes without uuid dependency

// Initial state
const initialState: AppState = {
  currentUser: null,
  users: [],
  products: [],
  shipments: [],
  events: [],
  ratings: [],
  payments: [],
  loading: false,
  error: null,
};

// State reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id 
            ? { ...user, ...action.payload.updates }
            : user
        ),
        currentUser: state.currentUser?.id === action.payload.id 
          ? { ...state.currentUser, ...action.payload.updates }
          : state.currentUser
      };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product => 
          product.id === action.payload.id 
            ? { ...product, ...action.payload.updates }
            : product
        )
      };
    
    case 'ADD_SHIPMENT':
      return { ...state, shipments: [...state.shipments, action.payload] };
    
    case 'UPDATE_SHIPMENT':
      return {
        ...state,
        shipments: state.shipments.map(shipment => 
          shipment.id === action.payload.id 
            ? { ...shipment, ...action.payload.updates }
            : shipment
        )
      };
    
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    
    case 'ADD_RATING':
      return { ...state, ratings: [...state.ratings, action.payload] };
    
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment => 
          payment.id === action.payload.id 
            ? { ...payment, ...action.payload.updates }
            : payment
        )
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_DEMO_DATA':
      return { ...initialState, ...generateDemoData() };
    
    case 'LOAD_STATE':
      return action.payload;
    
    default:
      return state;
  }
}

// Context
const DemoStoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = StorageService.load();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    } else {
      // Initialize with demo data if no saved state
      dispatch({ type: 'RESET_DEMO_DATA' });
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (state.users.length > 0) { // Only save if we have data
      StorageService.save(state);
    }
  }, [state]);

  return (
    <DemoStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoStoreContext.Provider>
  );
}

// Hook to use the store
export function useDemoStore() {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error('useDemoStore must be used within a DemoStoreProvider');
  }
  return context;
}

// Helper function to generate demo data
function generateDemoData(): Partial<AppState> {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Create demo users
  const users: UserProfile[] = [
    {
      id: 'farmer-1',
      role: 'farmer',
      name: 'Raghunath Pradhan',
      district: 'koraput',
      trustScore: 85,
      phone: '+91-9876543210',
      createdAt: now - 30 * oneDay,
      totalTransactions: 12,
      successfulDeliveries: 11
    },
    {
      id: 'farmer-2',
      role: 'farmer',
      name: 'Sunita Behera',
      district: 'sambalpur',
      trustScore: 92,
      phone: '+91-9876543211',
      createdAt: now - 45 * oneDay,
      totalTransactions: 18,
      successfulDeliveries: 17
    },
    {
      id: 'farmer-3',
      role: 'farmer',
      name: 'Bipin Kumar Sahu',
      district: 'ganjam',
      trustScore: 78,
      phone: '+91-9876543212',
      createdAt: now - 60 * oneDay,
      totalTransactions: 8,
      successfulDeliveries: 7
    },
    {
      id: 'transporter-1',
      role: 'transporter',
      name: 'Ramesh Transport Services',
      district: 'bhubaneswar',
      trustScore: 88,
      phone: '+91-9876543213',
      createdAt: now - 90 * oneDay,
      totalTransactions: 45,
      successfulDeliveries: 42
    },
    {
      id: 'transporter-2',
      role: 'transporter',
      name: 'Odisha Express Logistics',
      district: 'cuttack',
      trustScore: 91,
      phone: '+91-9876543214',
      createdAt: now - 75 * oneDay,
      totalTransactions: 38,
      successfulDeliveries: 36
    },
    {
      id: 'retailer-1',
      role: 'retailer',
      name: 'Green Valley Organics',
      district: 'bhubaneswar',
      trustScore: 86,
      phone: '+91-9876543215',
      createdAt: now - 50 * oneDay,
      totalTransactions: 25,
      successfulDeliveries: 24
    },
    {
      id: 'admin-1',
      role: 'admin',
      name: 'System Admin',
      district: 'bhubaneswar',
      trustScore: 100,
      createdAt: now - 365 * oneDay,
      totalTransactions: 0,
      successfulDeliveries: 0
    }
  ];

  // Create demo products
  const products: Product[] = [
    {
      id: 'prod-1',
      name: 'Organic Turmeric',
      category: 'turmeric',
      variety: 'Curcuma Longa',
      unit: 'kg',
      quantity: 50,
      farmerId: 'farmer-1',
      district: 'koraput',
      harvestDate: now - 7 * oneDay,
      expiryDate: now + 365 * oneDay,
      status: 'delivered',
      qrCodeId: 'gl-prod001',
      organicCertified: true,
      pricePerUnit: 120,
      createdAt: now - 7 * oneDay,
      description: 'Premium organic turmeric from Koraput hills',
      blockchainTx: '0x1234567890abcdef1234567890abcdef12345678'
    },
    {
      id: 'prod-2',
      name: 'Basmati Paddy',
      category: 'paddy',
      variety: 'Basmati 1121',
      unit: 'quintal',
      quantity: 5,
      farmerId: 'farmer-2',
      district: 'sambalpur',
      harvestDate: now - 14 * oneDay,
      expiryDate: now + 180 * oneDay,
      status: 'in_transit',
      qrCodeId: 'gl-prod002',
      pricePerUnit: 2500,
      createdAt: now - 14 * oneDay,
      description: 'High quality basmati paddy from Sambalpur',
      blockchainTx: '0xabcdef1234567890abcdef1234567890abcdef12'
    },
    {
      id: 'prod-3',
      name: 'Fresh Brinjal',
      category: 'brinjal',
      variety: 'Round Purple',
      unit: 'kg',
      quantity: 25,
      farmerId: 'farmer-3',
      district: 'ganjam',
      harvestDate: now - 2 * oneDay,
      expiryDate: now + 14 * oneDay,
      status: 'registered',
      qrCodeId: 'gl-prod003',
      pricePerUnit: 35,
      createdAt: now - 2 * oneDay,
      description: 'Fresh brinjal harvested from coastal Ganjam',
      blockchainTx: '0x567890abcdef1234567890abcdef1234567890ab'
    }
  ];

  // Create demo shipments
  const shipments: Shipment[] = [
    {
      id: 'ship-1',
      productIds: ['prod-1'],
      transporterId: 'transporter-1',
      originDistrict: 'koraput',
      destinationDistrict: 'bhubaneswar',
      status: 'delivered',
      createdAt: now - 5 * oneDay,
      actualPickup: now - 4 * oneDay,
      actualDelivery: now - 1 * oneDay,
      events: [],
      temperature: 22,
      humidity: 65
    },
    {
      id: 'ship-2',
      productIds: ['prod-2'],
      transporterId: 'transporter-2',
      originDistrict: 'sambalpur',
      destinationDistrict: 'bhubaneswar',
      status: 'in_transit',
      createdAt: now - 2 * oneDay,
      actualPickup: now - 1 * oneDay,
      estimatedDelivery: now + 1 * oneDay,
      events: [],
      temperature: 25,
      humidity: 60,
      currentLocation: { lat: 20.8, lng: 84.5 }
    }
  ];

  // Create demo ratings
  const ratings: Rating[] = [
    {
      id: 'rating-1',
      targetId: 'farmer-1',
      targetRole: 'farmer',
      fromId: 'retailer-1',
      fromRole: 'retailer',
      stars: 5,
      comment: 'Excellent quality turmeric, well packaged',
      createdAt: now - 1 * oneDay,
      productId: 'prod-1'
    },
    {
      id: 'rating-2',
      targetId: 'transporter-1',
      targetRole: 'transporter',
      fromId: 'retailer-1',
      fromRole: 'retailer',
      stars: 4,
      comment: 'On-time delivery, good handling',
      createdAt: now - 1 * oneDay,
      shipmentId: 'ship-1'
    }
  ];

  // Create demo payments
  const payments: Payment[] = [
    {
      id: 'pay-1',
      payerId: 'retailer-1',
      payeeId: 'farmer-1',
      productId: 'prod-1',
      amount: 6000,
      state: 'released',
      createdAt: now - 5 * oneDay,
      releasedAt: now - 1 * oneDay,
      escrowReleaseCondition: 'delivery_confirmed',
      currency: 'INR'
    },
    {
      id: 'pay-2',
      payerId: 'retailer-1',
      payeeId: 'farmer-2',
      productId: 'prod-2',
      amount: 12500,
      state: 'escrowed',
      createdAt: now - 2 * oneDay,
      escrowReleaseCondition: 'delivery_confirmed',
      currency: 'INR'
    }
  ];

  // Create demo events for products
  const events: Event[] = [
    // Events for prod-1 (Organic Turmeric)
    {
      id: 'event-1',
      productId: 'prod-1',
      type: 'registration',
      actorId: 'farmer-1',
      actorRole: 'farmer',
      timestamp: now - 7 * oneDay,
      location: 'Koraput, Odisha',
      notes: 'Organic turmeric registered with certification'
    },
    {
      id: 'event-2', 
      productId: 'prod-1',
      type: 'pickup_scheduled',
      actorId: 'transporter-1',
      actorRole: 'transporter',
      timestamp: now - 5 * oneDay,
      location: 'Koraput, Odisha',
      notes: 'Pickup scheduled for transport to Bhubaneswar'
    },
    {
      id: 'event-3',
      productId: 'prod-1',
      type: 'picked_up',
      actorId: 'transporter-1',
      actorRole: 'transporter',
      timestamp: now - 4 * oneDay,
      location: 'Koraput, Odisha',
      temperature: 22,
      humidity: 65,
      notes: 'Product collected from farm in refrigerated truck'
    },
    {
      id: 'event-4',
      productId: 'prod-1',
      type: 'temperature_log',
      actorId: 'transporter-1',
      actorRole: 'transporter',
      timestamp: now - 3 * oneDay,
      location: 'En route to Bhubaneswar',
      temperature: 24,
      humidity: 62,
      notes: 'Temperature check during transit'
    },
    {
      id: 'event-5',
      productId: 'prod-1',
      type: 'delivered',
      actorId: 'transporter-1',
      actorRole: 'transporter',
      timestamp: now - 1 * oneDay,
      location: 'Bhubaneswar, Odisha',
      temperature: 23,
      humidity: 63,
      notes: 'Successfully delivered to Green Valley Organics'
    },
    {
      id: 'event-6',
      productId: 'prod-1',
      type: 'verified',
      actorId: 'retailer-1',
      actorRole: 'retailer',
      timestamp: now - 1 * oneDay,
      location: 'Bhubaneswar, Odisha',
      notes: 'Quality verified and accepted by retailer'
    },

    // Events for prod-2 (Basmati Paddy)
    {
      id: 'event-7',
      productId: 'prod-2',
      type: 'registration',
      actorId: 'farmer-2',
      actorRole: 'farmer',
      timestamp: now - 14 * oneDay,
      location: 'Sambalpur, Odisha',
      notes: 'Premium Basmati 1121 variety registered'
    },
    {
      id: 'event-8',
      productId: 'prod-2',
      type: 'pickup_scheduled',
      actorId: 'transporter-2',
      actorRole: 'transporter',
      timestamp: now - 2 * oneDay,
      location: 'Sambalpur, Odisha',
      notes: 'Transport arranged for delivery to processing center'
    },
    {
      id: 'event-9',
      productId: 'prod-2',
      type: 'picked_up',
      actorId: 'transporter-2',
      actorRole: 'transporter',
      timestamp: now - 1 * oneDay,
      location: 'Sambalpur, Odisha',
      temperature: 25,
      humidity: 60,
      notes: 'Collected and loaded for transport'
    },
    {
      id: 'event-10',
      productId: 'prod-2',
      type: 'status_update',
      actorId: 'transporter-2',
      actorRole: 'transporter',
      timestamp: now - 12 * 60 * 60 * 1000, // 12 hours ago
      location: 'Angul, Odisha',
      temperature: 26,
      humidity: 58,
      notes: 'Crossed Angul, on schedule for delivery'
    },

    // Events for prod-3 (Fresh Brinjal)
    {
      id: 'event-11',
      productId: 'prod-3',
      type: 'registration',
      actorId: 'farmer-3',
      actorRole: 'farmer',
      timestamp: now - 2 * oneDay,
      location: 'Ganjam, Odisha',
      notes: 'Fresh brinjal harvested and ready for market'
    }
  ];

  return {
    users,
    products,
    shipments,
    events,
    ratings,
    payments,
    currentUser: users[0], // Default to first farmer
    loading: false,
    error: null
  };
}

// Utility functions for store operations
export const storeUtils = {
  calculateTrustScore: (userId: string, state: AppState): number => {
    const user = state.users.find(u => u.id === userId);
    if (!user) return 0;

    const userRatings = state.ratings.filter(r => r.targetId === userId);
    if (userRatings.length === 0) return user.trustScore;

    const averageRating = userRatings.reduce((sum, r) => sum + r.stars, 0) / userRatings.length;
    const baseScore = (averageRating / 5) * 100;
    
    // Adjust based on delivery success rate
    const successRate = user.totalTransactions > 0 
      ? (user.successfulDeliveries / user.totalTransactions) * 100 
      : baseScore;
    
    return Math.round((baseScore * 0.7) + (successRate * 0.3));
  },

  getUsersByRole: (role: UserRole, state: AppState): UserProfile[] => {
    return state.users.filter(u => u.role === role);
  },

  getProductsByFarmer: (farmerId: string, state: AppState): Product[] => {
    return state.products.filter(p => p.farmerId === farmerId);
  },

  getShipmentsByTransporter: (transporterId: string, state: AppState): Shipment[] => {
    return state.shipments.filter(s => s.transporterId === transporterId);
  },

  getProductById: (productId: string, state: AppState): Product | null => {
    return state.products.find(p => p.id === productId) || null;
  },

  getEventsForProduct: (productId: string, state: AppState): Event[] => {
    return state.events.filter(e => e.productId === productId).sort((a, b) => a.timestamp - b.timestamp);
  }
};