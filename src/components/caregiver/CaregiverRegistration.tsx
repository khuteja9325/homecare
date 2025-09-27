import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ServiceSelection from './registration/ServiceSelection';
import PersonalInfo from './registration/PersonalInfo';
import DocumentUpload from './registration/DocumentUpload';
import VerificationStep from './registration/VerificationStep';
import PaymentStep from './registration/PaymentStep';
import ProfileCreation from './registration/ProfileCreation';

// Unified Props Interface for all registration steps
interface RegistrationStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  currentStep: number;
}

export interface RegistrationData {
  serviceType: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    age: string;
    address: string;
    qualification: string;
    experience: string;
  };
  documents: {
    aadhaarCard: File | null;
    panCard: File | null;
    professionalId: string;
    policeVerification: File | null;
  };
  verification: {
    status: 'pending' | 'success' | 'failed' | null;
    documentsValid: boolean;
    professionalIdValid: boolean;
  };
  payment: {
    completed: boolean;
    amount: number;
    transactionId: string;
  };
  profile: {
    specializations: string[];
    languages: string[];
    description: string;
    pricing: {
      hourly: number;
      daily: number;
      weekly: number;
    };
    availability: {
      days: string[];
      timeSlots: string[];
    };
  };
}

const CaregiverRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    serviceType: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      age: '',
      address: '',
      qualification: '',
      experience: ''
    },
    documents: {
      aadhaarCard: null,
      panCard: null,
      professionalId: '',
      policeVerification: null
    },
    verification: {
      status: null,
      documentsValid: false,
      professionalIdValid: false
    },
    payment: {
      completed: false,
      amount: 500,
      transactionId: ''
    },
    profile: {
      specializations: [],
      languages: [],
      description: '',
      pricing: {
        hourly: 0,
        daily: 0,
        weekly: 0
      },
      availability: {
        days: [],
        timeSlots: []
      }
    }
  });

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const steps = [ 
    { number: 1, title: 'Service Selection', component: ServiceSelection },
    { number: 2, title: 'Personal Information', component: PersonalInfo },
    { number: 3, title: 'Document Upload', component: DocumentUpload },
    { number: 4, title: 'Verification', component: VerificationStep },
    { number: 5, title: 'Payment', component: PaymentStep },
    { number: 6, title: 'Profile Creation', component: ProfileCreation }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    updateUser({ profileComplete: true });
    navigate('/caregiver/dashboard');
  };

  const updateRegistrationData = (updates: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep - 1].component as React.ComponentType<RegistrationStepProps>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Caregiver Registration</h2>
          <p className="text-gray-600 mt-2">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep > step.number ? 'bg-green-500 text-white' :
                  currentStep === step.number ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? <CheckCircle className="h-5 w-5" /> : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <CurrentStepComponent
            data={registrationData}
            updateData={updateRegistrationData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onComplete={handleComplete}
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
};

export default CaregiverRegistration;