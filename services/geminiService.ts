import { GoogleGenerativeAI } from '@google/generative-ai';
import { Location, TravelStep, TravelPlan } from '../types/travel';
import { v4 as uuidv4 } from 'uuid';
import locationsData from '../data/locations.json';

// Note: In production, this should be stored in environment variables
const API_KEY = 'AIzaSyBOyaqrmCH0gSWtC3qxIKXAeWSnL0Q9bf8'; // Replace with actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiTravelService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  private locations: Location[] = [];

  constructor() {
    this.loadLocations();
  }

  private loadLocations() {
    this.locations = [
      ...locationsData.stations,
      ...locationsData.taxis,
      ...locationsData.hotels,
      ...locationsData.restaurants,
      ...locationsData.attractions
    ] as Location[];
  }

  async generateTravelPlan(
    destination: string,
    budget: number,
    travelers: number,
    duration: number,
    arrivalStation: string
  ): Promise<TravelPlan> {
    const prompt = `
      Create a detailed travel plan for ${travelers} travelers visiting ${destination} for ${duration} days with a budget of ₹${budget}.
      
      Starting point: ${arrivalStation}
      
      Please provide a step-by-step itinerary including:
      1. Transportation from arrival point
      2. Accommodation recommendations
      3. Daily activities and attractions
      4. Restaurant recommendations
      5. Local transportation
      
      Format the response as a JSON object with the following structure:
      {
        "steps": [
          {
            "stepNumber": 1,
            "type": "transport",
            "title": "Transportation from arrival",
            "locationName": "location name",
            "duration": "estimated time",
            "estimatedCost": cost_in_rupees,
            "notes": "additional information"
          }
        ],
        "totalEstimatedCost": total_cost,
        "recommendations": "general travel tips"
      }
      
      Keep the budget realistic and provide practical suggestions.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the AI response and create a structured travel plan
      const aiPlan = this.parseAIResponse(text);
      
      return this.createTravelPlan(
        destination,
        budget,
        travelers,
        duration,
        aiPlan
      );
    } catch (error) {
      console.error('Error generating travel plan:', error);
      // Fallback to a basic plan if AI fails
      return this.createFallbackPlan(destination, budget, travelers, duration, arrivalStation);
    }
  }

  private parseAIResponse(text: string): any {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    return null;
  }

  private createTravelPlan(
    destination: string,
    budget: number,
    travelers: number,
    duration: number,
    aiPlan: any
  ): TravelPlan {
    const planId = uuidv4();
    const steps: TravelStep[] = [];

    if (aiPlan && aiPlan.steps) {
      aiPlan.steps.forEach((step: any, index: number) => {
        const location = this.findOrCreateLocation(step.locationName, step.type);
        
        steps.push({
          id: uuidv4(),
          stepNumber: index + 1,
          type: step.type || 'activity',
          title: step.title,
          location,
          duration: step.duration,
          notes: step.notes,
          estimatedCost: step.estimatedCost || 0
        });
      });
    }

    return {
      id: planId,
      userId: 'user-1', // In a real app, this would come from authentication
      destination,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget,
      travelers,
      steps,
      totalEstimatedCost: aiPlan?.totalEstimatedCost || budget * 0.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private createFallbackPlan(
    destination: string,
    budget: number,
    travelers: number,
    duration: number,
    arrivalStation: string
  ): TravelPlan {
    const planId = uuidv4();
    const steps: TravelStep[] = [];

    // Add basic steps
    const station = this.locations.find(l => l.name.toLowerCase().includes(arrivalStation.toLowerCase()));
    const taxi = this.locations.find(l => l.type === 'taxi');
    const hotel = this.locations.find(l => l.type === 'hotel' && (l.price || 0) <= budget / duration);
    const attraction = this.locations.find(l => l.type === 'attraction');

    if (station) {
      steps.push({
        id: uuidv4(),
        stepNumber: 1,
        type: 'arrival',
        title: 'Arrival at Station',
        location: station,
        duration: '30 minutes',
        estimatedCost: 0
      });
    }

    if (taxi) {
      steps.push({
        id: uuidv4(),
        stepNumber: 2,
        type: 'transport',
        title: 'Transportation to City',
        location: taxi,
        duration: '2-3 hours',
        estimatedCost: taxi.price || 0
      });
    }

    if (hotel) {
      steps.push({
        id: uuidv4(),
        stepNumber: 3,
        type: 'accommodation',
        title: 'Check-in to Hotel',
        location: hotel,
        duration: `${duration} nights`,
        estimatedCost: (hotel.price || 0) * duration
      });
    }

    if (attraction) {
      steps.push({
        id: uuidv4(),
        stepNumber: 4,
        type: 'activity',
        title: 'Visit Attraction',
        location: attraction,
        duration: '4-5 hours',
        estimatedCost: attraction.price || 0
      });
    }

    return {
      id: planId,
      userId: 'user-1',
      destination,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget,
      travelers,
      steps,
      totalEstimatedCost: steps.reduce((sum, step) => sum + (step.estimatedCost || 0), 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private findOrCreateLocation(name: string, type: string): Location {
    // First, try to find existing location
    let location = this.locations.find(l => 
      l.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(l.name.toLowerCase())
    );

    if (!location) {
      // Create a new location with estimated coordinates
      const baseCoords = this.getBaseCoordinates(type);
      location = {
        id: uuidv4(),
        name,
        type: type as any,
        address: `${name}, Sikkim, India`,
        latitude: baseCoords.lat + (Math.random() - 0.5) * 0.01,
        longitude: baseCoords.lng + (Math.random() - 0.5) * 0.01,
        description: `AI-generated location: ${name}`,
        price: this.estimatePrice(type)
      };
      
      // Add to locations array for future use
      this.locations.push(location);
    }

    return location;
  }

  private getBaseCoordinates(type: string): { lat: number; lng: number } {
    // Base coordinates for Gangtok, Sikkim
    const base = { lat: 27.3314, lng: 88.6138 };
    
    switch (type) {
      case 'station':
        return { lat: 26.6854, lng: 88.3967 }; // NJP area
      case 'hotel':
      case 'restaurant':
        return base; // Gangtok center
      case 'attraction':
        return { lat: 27.2516, lng: 88.7575 }; // Tourist areas
      default:
        return base;
    }
  }

  private estimatePrice(type: string): number {
    switch (type) {
      case 'taxi':
        return 2000;
      case 'hotel':
        return 3000;
      case 'restaurant':
        return 500;
      case 'attraction':
        return 100;
      default:
        return 0;
    }
  }

  getAvailableLocations(): Location[] {
    return this.locations;
  }

  async addCustomLocation(location: Omit<Location, 'id'>): Promise<Location> {
    const newLocation: Location = {
      ...location,
      id: uuidv4()
    };
    
    this.locations.push(newLocation);
    return newLocation;
  }
}