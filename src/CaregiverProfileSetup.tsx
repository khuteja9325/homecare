import React, { useState, ChangeEvent, FormEvent } from 'react';
import { User, Mail, Phone, MapPin, FileText, Briefcase, PlusCircle, Trash2, Calendar, DollarSign } from 'lucide-react';

// Interfaces for data structures
interface Certification {
  name: string;
  organization: string;
  year: string;
}

interface Availability {
  days: string[];
  hours: string;
}

interface ProfileInfo {
  profilePicture: File | null;
  bio: string;
  specializations: string[];
  yearsOfExperience: string;
  hourlyRate: string;
  serviceAreas: string;
  availability: Availability;
  certifications: Certification[];
}

interface RegistrationData {
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
  credentials: {
    username: string;
    password: string;
    confirmPassword: string;
  };
  documents: {
    aadhaarCard: File | null;
    panCard: File | null;
    professionalId: string;
    policeVerification: File | null;
  };
  assessment: {
    completed: boolean;
    score: number;
  };
}

// Props interface for the component
interface CaregiverProfileSetupProps {
  registrationData: RegistrationData;
  onProfileComplete: (profileData: RegistrationData & { profileDetails: ProfileInfo }) => void;
}

const CaregiverProfileSetup: React.FC<CaregiverProfileSetupProps> = ({ registrationData, onProfileComplete }) => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    profilePicture: null,
    bio: '',
    specializations: [],
    yearsOfExperience: registrationData.personalInfo.experience || '',
    hourlyRate: '',
    serviceAreas: '',
    availability: {
      days: [],
      hours: ''
    },
    certifications: []
  });

  const [newSpecialization, setNewSpecialization] = useState<string>('');
  const [newCertification, setNewCertification] = useState<Certification>({ name: '', organization: '', year: '' });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() !== '') {
      setProfileInfo(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setProfileInfo(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.name && newCertification.organization && newCertification.year) {
      setProfileInfo(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification]
      }));
      setNewCertification({ name: '', organization: '', year: '' });
    }
  };

  const handleRemoveCertification = (index: number) => {
    setProfileInfo(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleDayToggle = (day: string) => {
    setProfileInfo(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const daysOfWeek: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullProfileData = {
      ...registrationData,
      profileDetails: profileInfo
    };
    console.log('Final Profile Data:', fullProfileData);
    onProfileComplete(fullProfileData);
  };

  const getServiceLabel = (serviceId: string): string => {
    switch (serviceId) {
      case 'nursing':
        return 'Nurse';
      case 'physiotherapy':
        return 'Physiotherapist';
      case 'postnatal':
        return 'Postnatal Caregiver';
      case 'babysitting':
        return 'Babysitter';
      default:
        return 'Caregiver';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Complete Your {getServiceLabel(registrationData.serviceType)} Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Professional Details Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline h-4 w-4 mr-1" />
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={profileInfo.yearsOfExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Hourly Rate (INR) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={profileInfo.hourlyRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Service Areas (e.g., specific neighborhoods or cities)
                </label>
                <input
                  type="text"
                  name="serviceAreas"
                  value={profileInfo.serviceAreas}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Delhi NCR, Mumbai Suburbs"
                />
              </div>
            </div>

            {/* Specializations Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Specializations</h3>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSpecialization(e.target.value)}
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Geriatric Care, Pediatric Nursing"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialization}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileInfo.specializations.map((spec, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <input
                  type="text"
                  value={newCertification.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                  className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Certificate Name"
                />
                <input
                  type="text"
                  value={newCertification.organization}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCertification(prev => ({ ...prev, organization: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Issuing Organization"
                />
                <input
                  type="number"
                  value={newCertification.year}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCertification(prev => ({ ...prev, year: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Year"
                  min="1900"
                />
              </div>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Certification
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {profileInfo.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>
                      <strong className="text-gray-900">{cert.name}</strong> from {cert.organization} ({cert.year})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bio Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Write a brief professional biography
              </label>
              <textarea
                name="bio"
                value={profileInfo.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your professional story, skills, and commitment to patient care."
              />
            </div>

            {/* Availability Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Availability</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Days of the Week
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      profileInfo.availability.days.includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typical Hours (e.g., 9:00 AM - 5:00 PM)
                </label>
                <input
                  type="text"
                  name="hours"
                  value={profileInfo.availability.hours}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileInfo(prev => ({
                    ...prev,
                    availability: { ...prev.availability, hours: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaregiverProfileSetup;