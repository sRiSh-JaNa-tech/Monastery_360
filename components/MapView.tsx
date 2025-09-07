import React, { useEffect, useRef } from 'react';
import { TravelPlan } from '../types/travel';

interface MapViewProps {
  plan: TravelPlan | null;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({ plan, className = '' }) => {
  const mapRef = useRef<HTMLIFrameElement>(null);

  const generateMapUrl = () => {
    const apiKey = 'AIzaSyCaACwjcWVwRy0RsmAD3v_wcC7DmMncZxQ'; // Replace with your actual API key
    const baseUrl = 'https://www.google.com/maps/embed/v1/place';
    
    if (!plan || plan.steps.length === 0) {
      // Default to Sikkim center
      return `${baseUrl}?key=${apiKey}&q=Gangtok,Sikkim&zoom=10`;
    }

    // Use the first location as the center
    const firstLocation = plan.steps[0]?.location;
    if (firstLocation) {
      const query = encodeURIComponent(`${firstLocation.latitude},${firstLocation.longitude}`);
      return `${baseUrl}?key=${apiKey}&q=${query}&zoom=12`;
    }

    return `${baseUrl}?key=${apiKey}&q=Sikkim,India&zoom=8`;
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.src = generateMapUrl();
    }
  }, [plan]);

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Travel Route</h3>
        <p className="text-sm text-gray-600">
          {plan ? `${plan.steps.length} locations marked` : 'Map will show your travel locations'}
        </p>
      </div>
      <div className="relative h-96">
        <iframe
          ref={mapRef}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={generateMapUrl()}
        />
        {plan && plan.steps.length > 0 && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
            <h4 className="font-medium text-gray-900 mb-2">Locations</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {plan.steps.map((step, index) => (
                <div key={step.id} className="flex items-center text-sm">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 truncate">{step.location.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};