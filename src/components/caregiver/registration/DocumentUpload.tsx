import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, Loader2, ArrowLeft, ArrowRight, UploadCloud, XCircle } from 'lucide-react';
import { RegistrationData } from 'C:/Users/ASUS/homecare/src/components/caregiver/CaregiverRegistration.tsx';

// Define a type for a single document state
type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'failed';

interface VerificationStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  // NEW STATE: Manage the upload status of required documents
  const [documentUploadStatus, setDocumentUploadStatus] = useState<Record<string, DocumentStatus>>({
    aadhaar: 'uploaded', // Assuming these were uploaded in a previous step
    pan: 'uploaded',    // The actual verification is what happens here
    professionalId: (data.serviceType === 'nursing' || data.serviceType === 'physiotherapy') ? 'uploaded' : 'uploaded',
    police: (data.serviceType === 'babysitting' || data.serviceType === 'postnatal') ? 'uploaded' : 'uploaded',
  });
  const [isUploading, setIsUploading] = useState(false);


  // --- Helper to list the required documents ---
  const getRequiredDocuments = () => {
    const documents = [
      { key: 'aadhaar', name: 'Aadhaar Card', required: true, details: 'Proof of identity and address.' },
      { key: 'pan', name: 'PAN Card', required: true, details: 'Tax identity verification.' }
    ];

    if (data.serviceType === 'nursing') {
      documents.push({ key: 'professionalId', name: 'NUID Certificate', required: true, details: 'National Unique ID for Nurses.' });
    } else if (data.serviceType === 'physiotherapy') {
      documents.push({ key: 'professionalId', name: 'IAP Membership Proof', required: true, details: 'Indian Association of Physiotherapists ID.' });
    } else if (data.serviceType === 'babysitting' || data.serviceType === 'postnatal') {
      documents.push({ key: 'police', name: 'Police Verification Certificate', required: true, details: 'Mandatory background check.' });
    }
    return documents;
  };

  // NEW FUNCTION: Simulate document upload from file picker
  const handleDocumentUpload = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setIsUploading(true);
    setDocumentUploadStatus(prev => ({ ...prev, [key]: 'pending' }));

    // Simulate upload delay
    setTimeout(() => {
      // Simulate success/failure on upload (not verification yet)
      const success = Math.random() > 0.1; // 90% chance of successful *upload*

      setDocumentUploadStatus(prev => ({ 
        ...prev, 
        [key]: success ? 'uploaded' : 'failed' 
      }));
      setIsUploading(false);
    }, 1500);
  };

  // --- Verification Logic ---
  const startVerification = () => {
    // Check if all required documents are marked as 'uploaded'
    const allUploaded = getRequiredDocuments().every(doc => documentUploadStatus[doc.key] === 'uploaded');
    if (!allUploaded) {
      alert("Please ensure all required documents are successfully uploaded before starting verification.");
      return;
    }

    if (isVerifying) return;
    setIsVerifying(true);
    
    // Simulate verification process (same logic as before)
    setTimeout(() => {
      const documentsValid = Math.random() > 0.2; 
      
      let professionalIdValid = true;
      if (data.serviceType === 'nursing') {
        professionalIdValid = data.documents.professionalId.startsWith('NUID');
      } else if (data.serviceType === 'physiotherapy') {
        professionalIdValid = data.documents.professionalId.startsWith('IAP');
      } 

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
    // Reset failed upload status for retry
    setDocumentUploadStatus(prev => {
        const newState = { ...prev };
        for (const key in newState) {
            if (newState[key] === 'failed') {
                newState[key] = 'pending';
            }
        }
        return newState;
    });
  };

  // --- Component Render ---
  return (
    <div className="space-y-8 max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
          Document Upload & Verification
        </h3>
        <p className="text-gray-500">
          Upload any pending documents, then initiate the automated background check.
        </p>
      </div>
      
      {/* State: Ready to Start Verification (Modified to include Uploads) */}
      {data.verification.status === null && !isVerifying && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
               <UploadCloud className="h-6 w-6 text-blue-600" />
               <h4 className="font-bold text-xl text-blue-900">Required Documents Checklist</h4>
            </div>

            {/* Document List */}
            <ul className="space-y-4 text-sm">
                {getRequiredDocuments().map((doc) => (
                    <li key={doc.key} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className='flex flex-col flex-grow'>
                            <p className="font-semibold text-gray-800">{doc.name}</p>
                            <p className='text-xs text-gray-500'>{doc.details}</p>
                        </div>

                        <label htmlFor={`upload-${doc.key}`} className={`cursor-pointer ml-4 p-2 rounded-full transition-colors ${documentUploadStatus[doc.key] === 'uploaded' ? 'bg-green-100 text-green-700' : documentUploadStatus[doc.key] === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}>
                            {documentUploadStatus[doc.key] === 'uploaded' ? (
                                <CheckCircle className='h-5 w-5' />
                            ) : documentUploadStatus[doc.key] === 'failed' ? (
                                <XCircle className='h-5 w-5' />
                            ) : isUploading ? (
                                <Loader2 className='h-5 w-5 animate-spin' />
                            ) : (
                                <UploadCloud className='h-5 w-5' />
                            )}
                            <input 
                                id={`upload-${doc.key}`} 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.jpg,.png"
                                onChange={handleDocumentUpload(doc.key)}
                                disabled={isUploading || documentUploadStatus[doc.key] === 'uploaded'}
                            />
                        </label>
                    </li>
                ))}
            </ul>
          </div>
          
          <div className="text-center pt-2">
            <button
              onClick={startVerification}
              disabled={isUploading || getRequiredDocuments().some(doc => documentUploadStatus[doc.key] !== 'uploaded')}
              className={`w-full py-3 px-8 rounded-xl shadow-lg transition-all font-bold text-lg focus:outline-none focus:ring-4 ${
                getRequiredDocuments().some(doc => documentUploadStatus[doc.key] !== 'uploaded')
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300'
              }`}
            >
              Start Verification Process
            </button>
            {getRequiredDocuments().some(doc => documentUploadStatus[doc.key] !== 'uploaded') && (
                <p className='text-red-500 text-sm mt-2'>Please upload all documents to continue.</p>
            )}
          </div>
        </div>
      )}

      {/* State: Verifying in Progress (Unchanged) */}
      {isVerifying && (
        <div className="text-center space-y-4 py-10 bg-gray-50 rounded-xl">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
          <div className="space-y-1">
            <p className="text-xl text-gray-700 font-semibold">Verification in Progress...</p>
            <p className="text-sm text-gray-500">This typically takes a few seconds to cross-reference databases.</p>
          </div>
        </div>
      )}

      {/* State: Success/Failed (Unchanged) */}
      {data.verification.status === 'success' && (
        <div className="text-center space-y-5 py-8 border border-green-300 bg-green-50 rounded-xl">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h4 className="text-2xl font-bold text-green-800">Verification Successful!</h4>
          <p className="text-green-700 px-4">
            All your credentials have been verified. You're one step closer to joining the team!
          </p>
        </div>
      )}

      {data.verification.status === 'failed' && (
        <div className="text-center space-y-5 py-8 border border-red-300 bg-red-50 rounded-xl">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
          <h4 className="text-2xl font-bold text-red-800">Verification Failed</h4>
          <div className="bg-white border border-red-200 rounded-lg p-4 mx-4 text-left shadow-sm">
            <p className="text-red-700 text-sm font-bold mb-2">Detailed Issues:</p>
            <ul className="space-y-2 text-sm text-red-600">
              {!data.verification.documentsValid && (
                <li className='flex items-center'><AlertCircle className='h-4 w-4 mr-2 flex-shrink-0' /> Document data check failed. Please **re-upload** clear copies of your documents (Aadhaar/PAN).</li>
              )}
              {!data.verification.professionalIdValid && (
                <li className='flex items-center'>
                  <AlertCircle className='h-4 w-4 mr-2 flex-shrink-0' /> 
                  {data.serviceType === 'nursing' && "NUID number check failed. Ensure your professional ID is correct."}
                  {data.serviceType === 'physiotherapy' && "IAP Membership ID check failed. Ensure your professional ID is correct."}
                </li>
              )}
            </ul>
          </div>
          <button
            onClick={handleRetry}
            className="mt-4 bg-red-600 text-white py-2 px-8 rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            Retry Verification
          </button>
        </div>
      )}

      {/* --- Footer Navigation --- */}
      <div className="flex justify-between space-x-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onPrevious}
          className="flex items-center justify-center bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
          disabled={isVerifying}
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Previous
        </button>
        
        {data.verification.status === 'success' && (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg shadow-blue-200"
          >
            Proceed to Payment <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VerificationStep;
// export default DocumentUpload;