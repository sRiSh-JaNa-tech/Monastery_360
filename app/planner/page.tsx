
"use client"

import { useState, useEffect } from "react"
import { PlannerState, TravelPlan } from "@/types/travel"
import { GeminiTravelService } from "@/services/geminiService"
import { StepIndicator } from "@/components/StepIndicator"
import { UserInfoForm } from "@/components/UserInfoForm"
import { TravelPlanDisplay } from "@/components/TravelPlanDisplay"
import { SiteHeader } from "@/components/site-header"
import { MapView } from "@/components/MapView"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Sparkles } from "lucide-react"

export default function App() {
  const [state, setState] = useState<PlannerState>({
    currentStep: 0,
    userInfo: {
      name: "",
      arrivalStation: "",
      budget: 0,
      travelers: 0,
      duration: 0
    },
    plan: null,
    isGenerating: false,
    availableLocations: []
  })

  const [geminiService] = useState(() => new GeminiTravelService())

  useEffect(() => {
    // Load available locations
    const locations = geminiService.getAvailableLocations()
    setState(prev => ({ ...prev, availableLocations: locations }))
  }, [geminiService])

  const stepTitles = ["Trip Details", "Planning", "Your Itinerary"]

  const handleUserInfoSubmit = async (userInfo: typeof state.userInfo) => {
    setState(prev => ({ 
      ...prev, 
      userInfo, 
      currentStep: 1, 
      isGenerating: true 
    }))

    try {
      const plan = await geminiService.generateTravelPlan(
        "Sikkim", // Default destination
        userInfo.budget,
        userInfo.travelers,
        userInfo.duration,
        userInfo.arrivalStation
      )

      setState(prev => ({
        ...prev,
        plan,
        currentStep: 2,
        isGenerating: false
      }))
    } catch (error) {
      console.error("Error generating plan:", error)
      setState(prev => ({ ...prev, isGenerating: false }))
    }
  }

  const handlePlanUpdate = (updatedPlan: TravelPlan) => {
    setState(prev => ({ ...prev, plan: updatedPlan }))
  }

  const handleAddLocation = async (location: any) => {
    return await geminiService.addCustomLocation(location)
  }

  const resetPlanner = () => {
    setState({
      currentStep: 0,
      userInfo: {
        name: "",
        arrivalStation: "",
        budget: 0,
        travelers: 0,
        duration: 0
      },
      plan: null,
      isGenerating: false,
      availableLocations: state.availableLocations
    })
  }

  const updatePlanTitle = (newTitle: string) => {
    if (state.plan) {
      const updatedPlan = {
        ...state.plan,
        destination: newTitle,
        updatedAt: new Date().toISOString()
      }
      setState(prev => ({ ...prev, plan: updatedPlan }))
    }
  }

  return (
    <div className="min-h-screen bg-[url('/losar-festival-sikkim-monastery.jpg')] bg-cover bg-center bg-blend-overlay bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* New Plan Button */}
        {state.plan && (
          <button
            onClick={resetPlanner}
            className="fixed top-20 right-4 sm:right-8 z-10 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Plan
          </button>
        )}

        {/* Step Indicator */}
        <div className="bg-white shadow-lg rounded-2xl mb-3">
          <StepIndicator
            currentStep={state.currentStep}
            totalSteps={stepTitles.length}
            stepTitles={stepTitles}
          />
        </div>

        {/* Content based on current step */}
        {state.currentStep === 0 && (
          <div className="bg-white shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
            <UserInfoForm onSubmit={handleUserInfoSubmit} />
          </div>
        )}

        {state.currentStep === 1 && state.isGenerating && (
          <div className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
            <LoadingSpinner message="Creating your personalized travel itinerary..." />
          </div>
        )}

        {state.currentStep === 2 && state.plan && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
              <div className="mb-4">
                <input
                  type="text"
                  value={state.plan.destination}
                  onChange={(e) => updatePlanTitle(e.target.value)}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors w-full"
                  placeholder="Enter destination"
                />
              </div>
              <TravelPlanDisplay
                plan={state.plan}
                availableLocations={state.availableLocations}
                onUpdatePlan={handlePlanUpdate}
                onAddLocation={handleAddLocation}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-24 transition-all duration-300 hover:shadow-xl">
                <MapView plan={state.plan} className="w-full h-[400px] rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-50 to-purple-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-700">
            <p className="mb-2 text-lg font-semibold">© 2024 Travel Planner</p>
            <p className="text-sm">Plan smarter, travel better.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}