import React, { useState } from 'react';
import { Briefcase, FileText, Upload } from 'lucide-react';
// FIX: Using the explicit absolute path for the parent component to resolve import errors.
import { RegistrationData } from '../CaregiverRegistration';

interface ProfessionalInfoStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (data.experience <= 0) newErrors.experience = 'Experience must be greater than 0 years.';
    if (!data.qualifications || data.qualifications.length < 10) newErrors.qualifications = 'A detailed qualifications summary is required.';
    // Note: documents.professionalId is a nested update, so we handle its error separately for clarity
    if (!data.documents.professionalId) newErrors.professionalId = 'Professional ID (e.g., NUID/License) is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'professionalId') {
        // Handle nested update for documents
        updateData({ documents: { ...data.documents, professionalId: value } });
    } else if (name === 'experience') {
        updateData({ experience: parseInt(value) || 0 });
    } else {
        // Handle flat updates for qualifications
        updateData({ [name]: value } as Partial<RegistrationData>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">2. Professional Details</h3>

      {/* Experience */}
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 flex items-center"><Briefcase size={16} className="mr-1"/> Years of Experience</label>
        <input
          type="number"
          id="experience"
          name="experience"
          value={data.experience}
          onChange={handleInputChange}
          min="0"
          className={`mt-1 block w-full border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="e.g., 5"
        />
        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
      </div>

      {/* Qualifications */}
      <div>
        <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 flex items-center"><FileText size={16} className="mr-1"/> Qualifications Summary</label>
        <textarea
          id="qualifications"
          name="qualifications"
          value={data.qualifications}
          onChange={handleInputChange}
          rows={3}
          className={`mt-1 block w-full border ${errors.qualifications ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="e.g., Certified in Advanced First Aid, 3 years experience in ICU."
        />
        {errors.qualifications && <p className="text-red-500 text-xs mt-1">{errors.qualifications}</p>}
      </div>
      
      {/* Professional ID (Document placeholder) */}
      <div>
        <label htmlFor="professionalId" className="block text-sm font-medium text-gray-700 flex items-center"><Upload size={16} className="mr-1"/> Professional License/ID Number</label>
        <input
          type="text"
          id="professionalId"
          name="professionalId"
          // Note: Accessing nested document field for value
          value={data.documents.professionalId}
          onChange={handleInputChange}
          className={`mt-1 block w-full border ${errors.professionalId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter NUID or license number"
        />
        {errors.professionalId && <p className="text-red-500 text-xs mt-1">{errors.professionalId}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Next: Verification →
        </button>
      </div>
    </form>
  );
};

export default ProfessionalInfoStep;
