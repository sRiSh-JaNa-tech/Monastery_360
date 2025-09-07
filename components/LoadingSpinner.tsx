import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Generating your perfect travel plan...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 bg-white rounded-xl shadow-lg p-12">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
        AI is working its magic
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {message}
      </p>
      <div className="mt-6 flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};