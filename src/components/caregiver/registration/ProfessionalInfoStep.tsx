import React from 'react';
import { ArrowRight, User } from 'lucide-react';
// Correct import path for the interface
import { RegistrationData } from '../CaregiverRegistration.tsx';

// FIX: Added onPrevious to the props interface to resolve the assignment error in the parent component.
interface BasicInfoStepProps {
  data: RegistrationData; // Or equivalent type
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious?: () => void; // Added for structural consistency, made optional as it's Step 1
}
const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  
  // Checks if all required fields for this step are filled
  const isFormValid = 
    data.firstName.trim() !== '' &&
    data.lastName.trim() !== '' &&
    data.email.trim() !== '' &&
    data.phone.trim() !== '' &&
    data.serviceType !== '';

  // FIX: Updated handleSubmit to include onPrevious in props list, though it remains unused here.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    } else {
      // NOTE: alert() should ideally be replaced with a custom modal in a real app.
      alert("Please fill in all required fields and select a service type.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-2xl font-semibold text-gray-900">Step 1: Basic Information</h3>
        <p className="text-gray-600 text-sm">Tell us a little about yourself and your primary service.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            id="firstName"
            type="text" 
            placeholder="e.g., Jane" 
            value={data.firstName} 
            onChange={(e) => updateData({ firstName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            id="lastName"
            type="text" 
            placeholder="e.g., Doe" 
            value={data.lastName} 
            onChange={(e) => updateData({ lastName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          id="email"
          type="email" 
          placeholder="jane.doe@example.com" 
          value={data.email} 
          onChange={(e) => updateData({ email: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input 
          id="phone"
          type="tel" 
          placeholder="e.g., 9876543210" 
          value={data.phone} 
          onChange={(e) => updateData({ phone: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Service Type */}
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Primary Service Offering</label>
        <select 
          id="serviceType"
          value={data.serviceType} 
          onChange={(e) => updateData({ serviceType: e.target.value as any })}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="" disabled>Select a service type</option>
          <option value="nursing">Certified Nursing Care</option>
          <option value="physiotherapy">Physiotherapy / Rehab</option>
          <option value="babysitting">Babysitting / Childcare</option>
          <option value="postnatal">Postnatal Care / Japa Maid</option>
        </select>
      </div>
      
      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={!isFormValid}
        className={`w-full flex items-center justify-center py-3 rounded-lg font-semibold transition-colors text-lg ${
          isFormValid 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Continue to Professional Details <ArrowRight className="h-5 w-5 ml-2" />
      </button>
    </form>
  );
};

export default BasicInfoStep;
