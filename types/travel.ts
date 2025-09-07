export interface Location {
  id: string;
  name: string;
  type: 'station' | 'taxi' | 'hotel' | 'restaurant' | 'attraction' | 'transport';
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  price?: number;
  rating?: number;
  amenities?: string[];
  contact?: string;
  operatingHours?: string;
}

export interface TravelStep {
  id: string;
  stepNumber: number;
  type: 'arrival' | 'transport' | 'accommodation' | 'activity' | 'dining';
  title: string;
  location: Location;
  duration?: string;
  notes?: string;
  estimatedCost?: number;
}

export interface TravelPlan {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  steps: TravelStep[];
  totalEstimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerState {
  currentStep: number;
  userInfo: {
    name: string;
    arrivalStation: string;
    budget: number;
    travelers: number;
    duration: number;
  };
  plan: TravelPlan | null;
  isGenerating: boolean;
  availableLocations: Location[];
}