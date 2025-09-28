// File: src/components/caregiver/registration/VerificationStep.tsx

import React, { useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { RegistrationData } from '../CaregiverRegistration.tsx';
type DocumentStatus = 'pending' | 'uploaded' | 'failed';

interface VerificationStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [documentUploadStatus, setDocumentUploadStatus] = useState<Record<string, DocumentStatus>>({
    aadhaar: data.documents.nationalId ? 'uploaded' : 'pending',
    pan: 'pending',
    professionalId: 'pending',
    police: 'pending',
  });

  // Required documents depending on service type
  const getRequiredDocuments = () => {
    const docs = [
      { key: 'aadhaar', name: 'Aadhaar Card', details: 'Proof of identity and address.' },
      { key: 'pan', name: 'PAN Card', details: 'Tax identity verification.' },
    ];
    if (data.serviceType === 'nursing') docs.push({ key: 'professionalId', name: 'NUID Certificate', details: 'National Unique ID for Nurses.' });
    else if (data.serviceType === 'physiotherapy') docs.push({ key: 'professionalId', name: 'IAP Membership Proof', details: 'Indian Association of Physiotherapists ID.' });
    else if (data.serviceType === 'babysitting' || data.serviceType === 'postnatal') docs.push({ key: 'police', name: 'Police Verification Certificate', details: 'Mandatory background check.' });
    return docs;
  };

  const handleUpload = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setDocumentUploadStatus(prev => ({ ...prev, [key]: 'pending' }));

    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% chance success
      setDocumentUploadStatus(prev => ({ ...prev, [key]: success ? 'uploaded' : 'failed' }));
      if (success) updateData({ documents: { ...data.documents, [key]: file.name } });
      setIsUploading(false);
    }, 1500);
  };

  const startVerification = () => {
    if (isVerifying) return;

    const allUploaded = getRequiredDocuments().every(doc => documentUploadStatus[doc.key] === 'uploaded');
    if (!allUploaded) {
      alert('Please upload all required documents before verification.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      // simulate verification logic
      const documentsValid = true; // Changed from Math.random() > 0.2;
      let professionalIdValid = true;

      if (data.serviceType === 'nursing') professionalIdValid = data.documents.professionalId.startsWith('NUID');
      else if (data.serviceType === 'physiotherapy') professionalIdValid = data.documents.professionalId.startsWith('IAP');

      const overallSuccess = documentsValid && professionalIdValid;

      updateData({
        verification: {
          status: overallSuccess ? 'success' : 'failed',
          documentsValid,
          professionalIdValid,
        },
      });

      setIsVerifying(false);
    }, 2500);
};
  const handleNext = () => {
    if (data.verification?.status === 'success') onNext();
  };

  const handleRetry = () => {
    updateData({
      verification: { status: null, documentsValid: false, professionalIdValid: false },
    });
    setDocumentUploadStatus(prev => {
      const newState: Record<string, DocumentStatus> = { ...prev };
      for (const key in newState) if (newState[key] === 'failed') newState[key] = 'pending';
      return newState;
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Document Verification</h3>
      <p className="text-gray-600">Upload required documents to complete verification.</p>

      {getRequiredDocuments().map(doc => (
        <div key={doc.key} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-700">{doc.name}</p>
            <p className="text-sm text-gray-500">{doc.details}</p>
          </div>
          <div className="flex items-center space-x-2">
            {documentUploadStatus[doc.key] === 'uploaded' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {documentUploadStatus[doc.key] === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
            {documentUploadStatus[doc.key] === 'pending' && isUploading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
            <input type="file" accept=".pdf,.jpg,.png" onChange={handleUpload(doc.key)} className="hidden" id={`upload-${doc.key}`} disabled={isUploading || documentUploadStatus[doc.key] === 'uploaded'} />
            <label htmlFor={`upload-${doc.key}`} className="cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
              {documentUploadStatus[doc.key] === 'uploaded' ? 'Change' : 'Upload'}
            </label>
          </div>
        </div>
      ))}

      {data.verification.status === null && (
        <button
          onClick={startVerification}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isUploading || getRequiredDocuments().some(doc => documentUploadStatus[doc.key] !== 'uploaded')}
        >
          Start Verification
        </button>
      )}

      {data.verification.status === 'success' && (
        <div className="p-4 mt-4 bg-green-50 border border-green-300 rounded-lg text-green-700 font-semibold text-center">
          Verification Successful ✅
          <button onClick={handleNext} className="ml-4 px-4 py-1 bg-green-600 text-white rounded">Next</button>
        </div>
      )}

      {data.verification.status === 'failed' && (
        <div className="p-4 mt-4 bg-red-50 border border-red-300 rounded-lg text-red-700 font-semibold text-center">
          Verification Failed ❌
          <button onClick={handleRetry} className="ml-4 px-4 py-1 bg-red-600 text-white rounded">Retry</button>
        </div>
      )}

      <div className="flex justify-start mt-4">
        <button onClick={onPrevious} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">← Previous</button>
      </div>
    </div>
  );
};

export default VerificationStep;
