// File: src/components/caregiver/CaregiverRegistration.tsx

import React, { useState } from 'react';
import BasicInfoStep from 'C:/Users/ASUS/homecare/src/components/caregiver/BasicInfoStep.tsx';
import ProfessionalInfoStep from 'C:/Users/ASUS/homecare/src/components/caregiver/registration/ProfessionalInfoStep.tsx';
import VerificationStep from 'C:/Users/ASUS/homecare/src/components/caregiver/registration/VerificationStep.tsx';
import PaymentStep from 'C:/Users/ASUS/homecare/src/components/caregiver/registration/PaymentStep.tsx';
import AssessmentStep from 'C:/Users/ASUS/homecare/src/components/caregiver/registration/Assesment.tsx';

// --- Types ---
export interface PaymentData {
  completed: boolean;
  amount: number;
  transactionId: string;
}

export interface Documents {
  professionalId: string;
  nationalId: string; // Aadhaar, passport, etc.
}

export interface VerificationData {
  status: 'success' | 'failed' | null;
  documentsValid: boolean;
  professionalIdValid: boolean;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: 'nursing' | 'physiotherapy' | 'babysitting' | 'postnatal' | '';
  experience: number;
  qualifications: string;
  documents: Documents;
  verification: VerificationData;
  payment: PaymentData | null;
  isPaymentComplete: boolean;
  assessmentScore?: number; // new: store score for assessment
  assessmentPassed?: boolean; // new: true if score >= passing
}

// --- Initial Data ---
const initialData: RegistrationData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  serviceType: '',
  experience: 0,
  qualifications: '',
  documents: {
    professionalId: '',
    nationalId: '',
  },
  verification: {
    status: null,
    documentsValid: false,
    professionalIdValid: false
  },
  payment: null,
  isPaymentComplete: false,
  assessmentScore: undefined,
  assessmentPassed: undefined
};

// --- Steps ---
const STEPS = ["Personal Info", "Professional Info", "Assessment/Verification", "Verification", "Payment", "Complete"];
const TOTAL_STEPS = STEPS.length;
const ACTIVE_REGISTRATION_STEPS = TOTAL_STEPS - 1; // Steps 1-5 active

// --- Component ---
const CaregiverRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>(initialData);

  const updateData = (updates: Partial<RegistrationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const onNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(prev => prev + 1);
  };

  const onPrevious = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const progressPercentage = Math.min(100, ((currentStep - 1) / ACTIVE_REGISTRATION_STEPS) * 100);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={formData} updateData={updateData} onNext={onNext} />;
      case 2:
        return <ProfessionalInfoStep data={formData} updateData={updateData} onNext={onNext} onPrevious={onPrevious} />;
      case 3:
        // Only show AssessmentStep for babysitting/postnatal
        if (formData.serviceType === 'babysitting' || formData.serviceType === 'postnatal') {
          return <AssessmentStep 
                    data={formData} 
                    updateData={updateData} 
                    onNext={onNext} 
                    onPrevious={onPrevious} 
                 />;
        } else {
          return <VerificationStep data={formData} updateData={updateData} onNext={onNext} onPrevious={onPrevious} />;
        }
      case 4:
        return <VerificationStep data={formData} updateData={updateData} onNext={onNext} onPrevious={onPrevious} />;
      case 5:
        return <PaymentStep data={formData} updateData={updateData} onNext={onNext} onPrevious={onPrevious} />;
      default:
        return (
          <div className="text-center p-8 bg-green-50 rounded-lg shadow-inner border border-green-200">
            <h2 className="text-3xl font-bold text-green-700 mb-2">🎉 Registration Successful!</h2>
            <p className="text-lg text-gray-600">Your profile is now live. Welcome aboard.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Caregiver Registration</h1>
          <p className="mt-2 text-lg text-gray-600">Join our network of trusted home care professionals.</p>
        </div>

        <div className="mt-10 bg-white p-8 rounded-xl shadow-2xl">
          <div className="space-y-4">
            {currentStep <= ACTIVE_REGISTRATION_STEPS && (
              <>
                <h3 className="text-lg font-medium text-gray-700">
                  Step {currentStep} of {ACTIVE_REGISTRATION_STEPS}: {STEPS[currentStep - 1]}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </>
            )}

            <div className="mt-8">{renderStep()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverRegistration;
