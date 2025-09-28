import React, { useState } from 'react';
import { Briefcase, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { RegistrationData } from '../CaregiverRegistration.tsx';

// Define a type for localized errors
type ProfessionalErrors = {
  experience?: string;
  qualifications?: string;
  professionalId?: string;
};

interface ProfessionalInfoStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [errors, setErrors] = useState<ProfessionalErrors>({});

  // Dynamically change the label based on the selected service type
  const professionalIdLabel = 
    data.serviceType === 'nursing' 
      ? "NUID Certificate/License Number (Required)" 
      : data.serviceType === 'physiotherapy' 
      ? "IAP Membership ID (Required)" 
      : "Professional ID / Certificate Number (Required)";

  const validate = () => {
    const newErrors: ProfessionalErrors = {};
    if (data.experience < 0) newErrors.experience = 'Experience cannot be negative.';
    if (data.experience === 0) newErrors.experience = 'Please enter your years of experience.';
    if (data.qualifications.trim().length < 5) newErrors.qualifications = 'Please provide a brief summary of your highest qualification.';
    if (data.documents.professionalId.trim() === '') newErrors.professionalId = 'A valid professional ID is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateData({ experience: value || 0 });
    // Clear error instantly if value becomes valid
    if (value > 0) setErrors(prev => ({ ...prev, experience: undefined }));
  };
  
  // FIX: Correctly updates the nested 'documents' object by merging existing fields.
  const handleProfessionalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateData({ 
        documents: { 
            ...data.documents, // Spread existing documents (like nationalId)
            professionalId: value 
        } 
    });
    if (value.trim() !== '') setErrors(prev => ({ ...prev, professionalId: undefined }));
  };

  const handleQualificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateData({ qualifications: value });
    if (value.trim().length >= 5) setErrors(prev => ({ ...prev, qualifications: undefined }));
  };

  const isFormValid = Object.keys(errors).length === 0 && data.experience > 0 && data.qualifications.trim() !== '' && data.documents.professionalId.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6 border-b pb-4">
        <Briefcase className="h-10 w-10 text-blue-600 mx-auto mb-2 bg-blue-50 p-2 rounded-full shadow-sm" />
        <h3 className="text-2xl font-bold text-gray-900">Step 2: Professional Details</h3>
        <p className="text-gray-600 text-sm">Please provide your credentials and experience.</p>
      </div>

      {/* Years of Experience */}
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Relevant Experience</label>
        <input 
          id="experience"
          type="number" 
          placeholder="e.g., 5" 
          min="0"
          value={data.experience} 
          onChange={handleExperienceChange}
          className={`w-full p-3 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
          required
        />
        {errors.experience && <p className="text-red-500 text-xs mt-1 font-medium">{errors.experience}</p>}
      </div>

      {/* Qualifications */}
      <div>
        <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
        <input 
          id="qualifications"
          type="text" 
          placeholder="e.g., B.Sc. Nursing, Certified Child Care Professional" 
          value={data.qualifications} 
          onChange={handleQualificationsChange}
          className={`w-full p-3 border ${errors.qualifications ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
          required
        />
        {errors.qualifications && <p className="text-red-500 text-xs mt-1 font-medium">{errors.qualifications}</p>}
      </div>

      {/* Professional ID (Conditional Label) */}
      <div>
        <label htmlFor="professionalId" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileText size={16} className="mr-1 text-blue-500"/> {professionalIdLabel}
        </label>
        <input 
          id="professionalId"
          type="text" 
          placeholder="Enter your registration/license number"
          value={data.documents.professionalId} 
          onChange={handleProfessionalIdChange}
          className={`w-full p-3 border ${errors.professionalId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
          required
        />
        {errors.professionalId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.professionalId}</p>}
        <p className="mt-1 text-xs text-gray-500">This ID will be used in the next step for verification.</p>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex space-x-4 pt-4">
        <button 
          type="button" 
          onClick={onPrevious} 
          className="flex-1 inline-flex items-center justify-center bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 font-semibold transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Previous
        </button>
        <button 
          type="submit" 
          disabled={!isFormValid}
          className={`flex-1 inline-flex items-center justify-center py-3 rounded-xl font-semibold transition-all shadow-md text-lg ${
            isFormValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
          }`}
        >
          Next (Verification) <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </form>
  );
};

export default ProfessionalInfoStep;
