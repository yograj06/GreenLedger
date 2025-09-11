// Geographic service for Odisha districts and locations

export interface District {
  id: string;
  name: string;
  centroid: {
    lat: number;
    lng: number;
  };
  region: 'coastal' | 'northern' | 'southern' | 'western';
}

export interface RouteProgress {
  id: string;
  from: string;
  to: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  progress: number; // 0-100
  estimatedArrival: number; // timestamp
}

class GeoService {
  private readonly ODISHA_DISTRICTS: District[] = [
    // Coastal Region
    { id: 'bhadrak', name: 'Bhadrak', centroid: { lat: 21.0569, lng: 86.5144 }, region: 'coastal' },
    { id: 'balasore', name: 'Balasore', centroid: { lat: 21.4942, lng: 86.9336 }, region: 'coastal' },
    { id: 'kendrapara', name: 'Kendrapara', centroid: { lat: 20.5014, lng: 86.4222 }, region: 'coastal' },
    { id: 'jagatsinghpur', name: 'Jagatsinghpur', centroid: { lat: 20.2517, lng: 86.1739 }, region: 'coastal' },
    { id: 'cuttack', name: 'Cuttack', centroid: { lat: 20.4625, lng: 85.8828 }, region: 'coastal' },
    { id: 'khordha', name: 'Khordha', centroid: { lat: 20.1811, lng: 85.6055 }, region: 'coastal' },
    { id: 'puri', name: 'Puri', centroid: { lat: 19.8134, lng: 85.8314 }, region: 'coastal' },
    { id: 'nayagarh', name: 'Nayagarh', centroid: { lat: 20.1297, lng: 85.1056 }, region: 'coastal' },
    { id: 'ganjam', name: 'Ganjam', centroid: { lat: 19.3910, lng: 84.6800 }, region: 'coastal' },

    // Northern Region
    { id: 'mayurbhanj', name: 'Mayurbhanj', centroid: { lat: 21.9288, lng: 86.7378 }, region: 'northern' },
    { id: 'keonjhar', name: 'Keonjhar', centroid: { lat: 21.6297, lng: 85.5811 }, region: 'northern' },
    { id: 'sundargarh', name: 'Sundargarh', centroid: { lat: 22.1167, lng: 84.0167 }, region: 'northern' },
    { id: 'jharsuguda', name: 'Jharsuguda', centroid: { lat: 21.8644, lng: 84.0069 }, region: 'northern' },
    { id: 'sambalpur', name: 'Sambalpur', centroid: { lat: 21.4669, lng: 83.9812 }, region: 'northern' },
    { id: 'bargarh', name: 'Bargarh', centroid: { lat: 21.3344, lng: 83.6189 }, region: 'northern' },
    { id: 'dhenkanal', name: 'Dhenkanal', centroid: { lat: 20.6586, lng: 85.5978 }, region: 'northern' },
    { id: 'angul', name: 'Angul', centroid: { lat: 20.8400, lng: 85.1022 }, region: 'northern' },

    // Southern Region  
    { id: 'kandhamal', name: 'Kandhamal', centroid: { lat: 20.2333, lng: 84.1167 }, region: 'southern' },
    { id: 'boudh', name: 'Boudh', centroid: { lat: 20.4453, lng: 84.3300 }, region: 'southern' },
    { id: 'sonepur', name: 'Sonepur', centroid: { lat: 20.8333, lng: 83.9167 }, region: 'southern' },
    { id: 'rayagada', name: 'Rayagada', centroid: { lat: 19.1636, lng: 83.4128 }, region: 'southern' },
    { id: 'gajapati', name: 'Gajapati', centroid: { lat: 18.8551, lng: 84.1675 }, region: 'southern' },
    { id: 'koraput', name: 'Koraput', centroid: { lat: 18.8134, lng: 82.7067 }, region: 'southern' },
    { id: 'malkangiri', name: 'Malkangiri', centroid: { lat: 18.3478, lng: 81.8733 }, region: 'southern' },
    { id: 'nabarangpur', name: 'Nabarangpur', centroid: { lat: 19.2306, lng: 82.5489 }, region: 'southern' },

    // Western Region
    { id: 'kalahandi', name: 'Kalahandi', centroid: { lat: 19.9142, lng: 83.1661 }, region: 'western' },
    { id: 'nuapada', name: 'Nuapada', centroid: { lat: 20.7331, lng: 82.6169 }, region: 'western' },
    { id: 'bolangir', name: 'Bolangir', centroid: { lat: 20.7114, lng: 83.4422 }, region: 'western' },
    { id: 'debagarh', name: 'Debagarh', centroid: { lat: 21.5086, lng: 84.7347 }, region: 'western' }
  ];

  getDistricts(): District[] {
    return [...this.ODISHA_DISTRICTS];
  }

  getDistrictById(id: string): District | null {
    return this.ODISHA_DISTRICTS.find(d => d.id === id) || null;
  }

  getDistrictsByRegion(region: District['region']): District[] {
    return this.ODISHA_DISTRICTS.filter(d => d.region === region);
  }

  calculateDistance(from: District, to: District): number {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(to.centroid.lat - from.centroid.lat);
    const dLng = this.toRad(to.centroid.lng - from.centroid.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(from.centroid.lat)) * 
              Math.cos(this.toRad(to.centroid.lat)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  estimateDeliveryTime(from: string, to: string): number {
    const fromDistrict = this.getDistrictById(from);
    const toDistrict = this.getDistrictById(to);
    
    if (!fromDistrict || !toDistrict) return 24; // Default 24 hours
    
    const distance = this.calculateDistance(fromDistrict, toDistrict);
    const avgSpeed = 40; // km/h average including stops
    const hoursNeeded = distance / avgSpeed;
    
    return Math.max(hoursNeeded, 2); // Minimum 2 hours
  }

  generateRouteProgress(shipmentId: string, from: string, to: string): RouteProgress {
    const fromDistrict = this.getDistrictById(from);
    const toDistrict = this.getDistrictById(to);
    
    if (!fromDistrict || !toDistrict) {
      throw new Error('Invalid districts');
    }

    // Mock current progress (random for demo)
    const progress = Math.random() * 100;
    const estimatedHours = this.estimateDeliveryTime(from, to);
    
    // Interpolate current location based on progress
    const lat = fromDistrict.centroid.lat + 
                (toDistrict.centroid.lat - fromDistrict.centroid.lat) * (progress / 100);
    const lng = fromDistrict.centroid.lng + 
                (toDistrict.centroid.lng - fromDistrict.centroid.lng) * (progress / 100);

    return {
      id: shipmentId,
      from,
      to,
      currentLocation: { lat, lng },
      progress,
      estimatedArrival: Date.now() + (estimatedHours * 60 * 60 * 1000 * (1 - progress / 100))
    };
  }

  getCropsByDistrict(): Record<string, string[]> {
    return {
      'koraput': ['turmeric', 'black_pepper', 'coffee'],
      'sambalpur': ['paddy', 'groundnut', 'sesame'],
      'ganjam': ['cashew', 'coconut', 'turmeric'],
      'mayurbhanj': ['paddy', 'maize', 'vegetables'],
      'balasore': ['paddy', 'jute', 'vegetables'],
      'khordha': ['vegetables', 'flowers', 'fruits'],
      'cuttack': ['paddy', 'vegetables', 'sugarcane'],
      'puri': ['coconut', 'betel_vine', 'paddy'],
      'rayagada': ['turmeric', 'ginger', 'coffee']
    };
  }
}

export default new GeoService();