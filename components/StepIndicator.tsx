import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between">
        {stepTitles.map((title, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-2">
                {index < currentStep ? (
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                ) : index === currentStep ? (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                ) : (
                  <Circle className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <span className={`text-sm font-medium text-center max-w-20 ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {title}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <ArrowRight className="w-5 h-5 text-gray-300 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};