import React, { useState } from 'react';
import { DollarSign, Clock, Star } from 'lucide-react';
import { RegistrationData } from '../CaregiverRegistration';

interface ProfileCreationProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onComplete: () => void;
  onPrevious: () => void;
}

const ProfileCreation: React.FC<ProfileCreationProps> = ({ data, updateData, onComplete, onPrevious }) => {
  const [currentSection, setCurrentSection] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete();
    }
  };

  const updateProfile = (field: string, value: any) => {
    updateData({
      profile: {
        ...data.profile,
        [field]: value
      }
    });
  };

  const updatePricing = (field: string, value: number) => {
    updateData({
      profile: {
        ...data.profile,
        pricing: {
          ...data.profile.pricing,
          [field]: value
        }
      }
    });
  };

  const updateAvailability = (field: string, value: string[]) => {
    updateData({
      profile: {
        ...data.profile,
        availability: {
          ...data.profile.availability,
          [field]: value
        }
      }
    });
  };

  const toggleArrayItem = <T,>(array: T[], item: T): T[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Create Your Professional Profile
        </h3>
        <p className="text-gray-600">
          Section {currentSection} of 3: {
            currentSection === 1 ? 'Professional Details' :
            currentSection === 2 ? 'Pricing & Availability' :
            'Review & Complete'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentSection === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Critical Care', 'Post-operative Care', 'Elderly Care', 'Pediatric Care',
                  'Wound Care', 'Medication Management', 'Rehabilitation', 'Palliative Care'
                ].map((spec) => (
                  <label key={spec} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.profile.specializations.includes(spec)}
                      onChange={(e) => {
                        const newSpecs = e.target.checked
                          ? [...data.profile.specializations, spec]
                          : data.profile.specializations.filter((s: string) => s !== spec);
                        updateProfile('specializations', newSpecs);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada'].map((lang) => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.profile.languages.includes(lang)}
                      onChange={(e) => {
                        const newLangs = e.target.checked
                          ? [...data.profile.languages, lang]
                          : data.profile.languages.filter((l: string) => l !== lang);
                        updateProfile('languages', newLangs);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Description *
              </label>
              <textarea
                required
                rows={4}
                value={data.profile.description}
                onChange={(e) => updateProfile('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your experience, approach to care, and what makes you unique..."
              />
            </div>
          </>
        )}

        {currentSection === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Pricing (in ₹) *
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Per Hour</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={data.profile.pricing.hourly}
                    onChange={(e) => updatePricing('hourly', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Per Day</label>
                  <input
                    type="number"
                    required
                    min="500"
                    value={data.profile.pricing.daily}
                    onChange={(e) => updatePricing('daily', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Per Week</label>
                  <input
                    type="number"
                    required
                    min="3000"
                    value={data.profile.pricing.weekly}
                    onChange={(e) => updatePricing('weekly', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Available Days *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.profile.availability.days.includes(day)}
                      onChange={(_e) => {
                        const newDays = toggleArrayItem(data.profile.availability.days, day);
                        updateAvailability('days', newDays);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slots *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-10PM)', 'Night (10PM-6AM)'].map((slot) => (
                  <label key={slot} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.profile.availability.timeSlots.includes(slot)}
                      onChange={(_e) => {
                        const newSlots = toggleArrayItem(data.profile.availability.timeSlots, slot);
                        updateAvailability('timeSlots', newSlots);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {currentSection === 3 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-4">Profile Summary</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-green-800">Service:</span>
                  <span className="text-green-700 ml-2">{data.serviceType}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Specializations:</span>
                  <span className="text-green-700 ml-2">{data.profile.specializations.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Languages:</span>
                  <span className="text-green-700 ml-2">{data.profile.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Pricing:</span>
                  <span className="text-green-700 ml-2">
                    ₹{data.profile.pricing.hourly}/hr, ₹{data.profile.pricing.daily}/day, ₹{data.profile.pricing.weekly}/week
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Congratulations!
              </h4>
              <p className="text-gray-600">
                Your profile is ready. You can now start accepting bookings from customers.
              </p>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={currentSection === 1 ? onPrevious : () => setCurrentSection(currentSection - 1)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            ← Previous
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {currentSection === 3 ? 'Complete Registration' : 'Next Section →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCreation;