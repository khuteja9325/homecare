import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { RegistrationData } from '../CaregiverRegistration';

interface VerificationStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const startVerification = () => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      const documentsValid = Math.random() > 0.2; // 80% success rate
      const professionalIdValid = data.serviceType === 'nursing' ? 
        data.documents.professionalId.startsWith('NUID') :
        data.serviceType === 'physiotherapy' ?
        data.documents.professionalId.startsWith('IAP') :
        true; // For babysitting and postnatal, always pass if police verification is uploaded

      const overallSuccess = documentsValid && professionalIdValid;

      updateData({
        verification: {
          status: overallSuccess ? 'success' : 'failed',
          documentsValid,
          professionalIdValid
        }
      });

      setIsVerifying(false);
    }, 3000);
  };

  const handleNext = () => {
    if (data.verification.status === 'success') {
      onNext();
    }
  };

  const handleRetry = () => {
    updateData({
      verification: {
        status: null,
        documentsValid: false,
        professionalIdValid: false
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Document Verification
        </h3>
        <p className="text-gray-600">
          We need to verify your documents and professional credentials
        </p>
      </div>

      {data.verification.status === null && !isVerifying && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Ready for Verification</h4>
            <p className="text-blue-700 text-sm mb-4">
              We will verify the following:
            </p>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Aadhaar Card authenticity</li>
              <li>• PAN Card validation</li>
              {data.serviceType === 'nursing' && <li>• NUID registration status</li>}
              {data.serviceType === 'physiotherapy' && <li>• IAP Membership verification</li>}
              {(data.serviceType === 'babysitting' || data.serviceType === 'postnatal') && 
                <li>• Police verification certificate</li>
              }
              {(data.serviceType === 'babysitting' || data.serviceType === 'postnatal') && 
                <li>• Basic assessment completion</li>
              }
            </ul>
          </div>
          
          <div className="text-center">
            <button
              onClick={startVerification}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Verification Process
            </button>
          </div>
        </div>
      )}

      {isVerifying && (
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">Verifying your credentials...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      )}

      {data.verification.status === 'success' && (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h4 className="text-xl font-semibold text-green-700">Verification Successful!</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">
              All your documents have been verified successfully. You can now proceed to payment.
            </p>
          </div>
        </div>
      )}

      {data.verification.status === 'failed' && (
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h4 className="text-xl font-semibold text-red-700">Verification Failed</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-red-700 text-sm font-medium mb-2">Issues found:</p>
            <ul className="space-y-1 text-sm text-red-600">
              {!data.verification.documentsValid && (
                <li>• Document verification failed - Please check uploaded files</li>
              )}
              {!data.verification.professionalIdValid && (
                <>
                  {data.serviceType === 'nursing' && (
                    <li>• NUID number not found in database</li>
                  )}
                  {data.serviceType === 'physiotherapy' && (
                    <li>• IAP Membership ID not valid</li>
                  )}
                </>
              )}
            </ul>
          </div>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onPrevious}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          disabled={isVerifying}
        >
          ← Previous
        </button>
        {data.verification.status === 'success' && (
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Proceed to Payment →
          </button>
        )}
      </div>
    </div>
  );
};

export default VerificationStep;