import React, { useState } from 'react';
import { TravelPlan, TravelStep, Location } from '../types/travel';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Plus, 
  Minus, 
  Edit3, 
  Trash2,
  Car,
  Bed,
  Utensils,
  Camera,
  Navigation,
  Check,
  X,
  ChevronDown
} from 'lucide-react';

interface TravelPlanDisplayProps {
  plan: TravelPlan;
  availableLocations: Location[];
  onUpdatePlan: (updatedPlan: TravelPlan) => void;
  onAddLocation: (location: Omit<Location, 'id'>) => Promise<Location>;
}

export const TravelPlanDisplay: React.FC<TravelPlanDisplayProps> = ({
  plan,
  availableLocations,
  onUpdatePlan,
  onAddLocation
}) => {
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingDuration, setEditingDuration] = useState<string>('');
  const [editingCost, setEditingCost] = useState<number>(0);
  const [editingNotes, setEditingNotes] = useState<string>('');

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'arrival':
      case 'transport':
        return <Car className="w-5 h-5" />;
      case 'accommodation':
        return <Bed className="w-5 h-5" />;
      case 'dining':
        return <Utensils className="w-5 h-5" />;
      case 'activity':
        return <Camera className="w-5 h-5" />;
      default:
        return <Navigation className="w-5 h-5" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'arrival':
      case 'transport':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accommodation':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'dining':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'activity':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLocationsByType = (type: string) => {
    return availableLocations.filter(location => location.type === type);
  };

  const locationTypes = [
    { value: 'station', label: 'Railway Stations', icon: '🚂' },
    { value: 'taxi', label: 'Taxi Services', icon: '🚕' },
    { value: 'hotel', label: 'Hotels', icon: '🏨' },
    { value: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { value: 'attraction', label: 'Attractions', icon: '🏛️' },
    { value: 'transport', label: 'Transport', icon: '🚌' }
  ];

  const startEditing = (step: TravelStep) => {
    setEditingStep(step.id);
    setEditingTitle(step.title);
    setEditingDuration(step.duration || '');
    setEditingCost(step.estimatedCost || 0);
    setEditingNotes(step.notes || '');
  };

  const saveEditing = (stepId: string) => {
    updateStep(stepId, {
      title: editingTitle,
      duration: editingDuration,
      estimatedCost: editingCost,
      notes: editingNotes
    });
    setEditingStep(null);
  };

  const cancelEditing = () => {
    setEditingStep(null);
    setEditingTitle('');
    setEditingDuration('');
    setEditingCost(0);
    setEditingNotes('');
  };

  const addStep = () => {
    const newStep: TravelStep = {
      id: `step-${Date.now()}`,
      stepNumber: plan.steps.length + 1,
      type: 'activity',
      title: 'New Activity',
      location: availableLocations[0] || {
        id: 'temp',
        name: 'Select Location',
        type: 'attraction',
        address: 'To be determined',
        latitude: 27.3314,
        longitude: 88.6138
      },
      duration: '2 hours',
      estimatedCost: 0
    };

    const updatedPlan = {
      ...plan,
      steps: [...plan.steps, newStep],
      updatedAt: new Date().toISOString()
    };

    onUpdatePlan(updatedPlan);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = plan.steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, stepNumber: index + 1 }));

    const updatedPlan = {
      ...plan,
      steps: updatedSteps,
      totalEstimatedCost: updatedSteps.reduce((sum, step) => sum + (step.estimatedCost || 0), 0),
      updatedAt: new Date().toISOString()
    };

    onUpdatePlan(updatedPlan);
  };

  const updateStep = (stepId: string, updates: Partial<TravelStep>) => {
    const updatedSteps = plan.steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );

    const updatedPlan = {
      ...plan,
      steps: updatedSteps,
      totalEstimatedCost: updatedSteps.reduce((sum, step) => sum + (step.estimatedCost || 0), 0),
      updatedAt: new Date().toISOString()
    };

    onUpdatePlan(updatedPlan);
  };

  const updateStepLocation = (stepId: string, location: Location) => {
    updateStep(stepId, { location });
    setShowLocationDropdown(null);
  };

  const updateStepType = (stepId: string, type: string) => {
    const typeMapping: { [key: string]: any } = {
      'station': 'arrival',
      'taxi': 'transport',
      'transport': 'transport',
      'hotel': 'accommodation',
      'restaurant': 'dining',
      'attraction': 'activity'
    };

    updateStep(stepId, { type: typeMapping[type] || 'activity' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Plan Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your {plan.destination} Travel Plan
            </h2>
            <p className="text-gray-600">
              {plan.travelers} travelers • {plan.steps.length} steps • {plan.startDate} to {plan.endDate}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ₹{plan.totalEstimatedCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              Budget: ₹{plan.budget.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            plan.totalEstimatedCost <= plan.budget 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {plan.totalEstimatedCost <= plan.budget ? 'Within Budget' : 'Over Budget'}
          </div>
          <button
            onClick={addStep}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </button>
        </div>
      </div>

      {/* Travel Steps */}
      <div className="space-y-4">
        {plan.steps.map((step, index) => (
          <div key={step.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <div className={`p-3 rounded-lg border-2 ${getStepColor(step.type)} mr-4`}>
                    {getStepIcon(step.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
                        Step {step.stepNumber}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{step.type}</span>
                    </div>
                    
                    {/* Editable Title */}
                    {editingStep === step.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="text-xl font-semibold text-gray-900 border-2 border-blue-500 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-600"
                          placeholder="Enter step title"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editingDuration}
                            onChange={(e) => setEditingDuration(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Duration (e.g., 2 hours)"
                          />
                          <input
                            type="number"
                            value={editingCost}
                            onChange={(e) => setEditingCost(parseInt(e.target.value) || 0)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Estimated cost (₹)"
                          />
                        </div>
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500"
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                    ) : (
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {editingStep === step.id ? (
                    <>
                      <button
                        onClick={() => saveEditing(step.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(step)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Location Selection */}
              <div className="mb-4">
                <div className="relative">
                  <button
                    onClick={() => setShowLocationDropdown(showLocationDropdown === step.id ? null : step.id)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{step.location.name}</div>
                        <div className="text-sm text-gray-500">{step.location.address}</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                      showLocationDropdown === step.id ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Location Dropdown */}
                  {showLocationDropdown === step.id && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                      {locationTypes.map((type) => {
                        const locations = getLocationsByType(type.value);
                        if (locations.length === 0) return null;

                        return (
                          <div key={type.value} className="border-b border-gray-100 last:border-b-0">
                            <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-700 flex items-center">
                              <span className="mr-2">{type.icon}</span>
                              {type.label}
                            </div>
                            {locations.map((location) => (
                              <button
                                key={location.id}
                                onClick={() => {
                                  updateStepLocation(step.id, location);
                                  updateStepType(step.id, location.type);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">{location.name}</div>
                                <div className="text-sm text-gray-500">{location.address}</div>
                                {location.price && (
                                  <div className="text-xs text-green-600 mt-1">₹{location.price.toLocaleString()}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Step Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {step.duration && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{step.duration}</span>
                  </div>
                )}
                {step.estimatedCost !== undefined && (
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>₹{step.estimatedCost.toLocaleString()}</span>
                  </div>
                )}
                {step.location.rating && (
                  <div className="flex items-center text-gray-600">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span>{step.location.rating}/5</span>
                  </div>
                )}
              </div>

              {step.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{step.notes}</p>
                </div>
              )}

              {step.location.amenities && step.location.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {step.location.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {amenity.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}

              {step.location.contact && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Contact:</span> {step.location.contact}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {plan.steps.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Navigation className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No steps in your plan yet</h3>
          <p className="text-gray-600 mb-6">Add your first travel step to get started</p>
          <button
            onClick={addStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Step
          </button>
        </div>
      )}
    </div>
  );
};