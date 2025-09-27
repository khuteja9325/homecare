import React from 'react';
import { Upload, FileText } from 'lucide-react';
import { RegistrationData } from '../CaregiverRegistration';

interface DocumentUploadProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ data, updateData, onNext, onPrevious }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const updateDocuments = (field: string, value: string | File | null) => {
    updateData({
      documents: {
        ...data.documents,
        [field]: value
      }
    });
  };

  const handleFileUpload = (field: string) => {
    // Simulate file upload
    const mockFile = new File(['mock'], 'document.pdf', { type: 'application/pdf' });
    updateDocuments(field, mockFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Document Verification
        </h3>
        <p className="text-gray-600">
          Upload required documents for verification
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Aadhaar Card *
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => handleFileUpload('aadhaarCard')}
          >
            {data.documents.aadhaarCard ? (
              <div className="text-green-600">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Aadhaar Card uploaded successfully</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload Aadhaar Card</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            PAN Card *
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => handleFileUpload('panCard')}
          >
            {data.documents.panCard ? (
              <div className="text-green-600">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">PAN Card uploaded successfully</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload PAN Card</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {data.serviceType === 'nursing' && 'NUID Number *'}
            {data.serviceType === 'physiotherapy' && 'IAP Membership ID *'}
            {(data.serviceType === 'babysitting' || data.serviceType === 'postnatal') && 'Professional Reference'}
          </label>
          <input
            type="text"
            required={data.serviceType === 'nursing' || data.serviceType === 'physiotherapy'}
            value={data.documents.professionalId}
            onChange={(e) => updateDocuments('professionalId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              data.serviceType === 'nursing' ? 'Enter your NUID number' :
              data.serviceType === 'physiotherapy' ? 'Enter your IAP Membership ID' :
              'Enter reference details'
            }
          />
        </div>

        {(data.serviceType === 'babysitting' || data.serviceType === 'postnatal') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Police Verification Certificate *
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => handleFileUpload('policeVerification')}
            >
              {data.documents.policeVerification ? (
                <div className="text-green-600">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Police Verification uploaded successfully</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload Police Verification</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onPrevious}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          ← Previous
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Next Step →
        </button>
      </div>
    </form>
  );
};

export default DocumentUpload;