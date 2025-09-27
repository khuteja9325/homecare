import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import BookingModal from './BookingModal';

const CaregiverSearch: React.FC = () => {
  const [selectedService, setSelectedService] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedCaregiver, setSelectedCaregiver] = useState<string | null>(null);
  const { getCaregiversByService, caregivers } = useData();

  const services = [
    { id: 'nursing', name: 'Nursing Care' },
    { id: 'physiotherapy', name: 'Physiotherapy' },
    { id: 'postnatal', name: 'Postnatal Care' },
    { id: 'babysitting', name: 'Babysitting' }
  ];

  const filteredCaregivers = selectedService 
    ? getCaregiversByService(selectedService)
    : caregivers;

  const handleBookCaregiver = (caregiverId: string) => {
    setSelectedCaregiver(caregiverId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (Daily)
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Price</option>
              <option value="0-1000">₹0 - ₹1,000</option>
              <option value="1000-2000">₹1,000 - ₹2,000</option>
              <option value="2000-3000">₹2,000 - ₹3,000</option>
              <option value="3000+">₹3,000+</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Caregiver Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCaregivers.map((caregiver) => (
          <div key={caregiver.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {caregiver.personalInfo.fullName.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {caregiver.personalInfo.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">{caregiver.serviceType}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {caregiver.personalInfo.address}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {caregiver.professionalInfo.experience} years experience
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  {caregiver.ratings.average} ({caregiver.ratings.total} reviews)
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {caregiver.professionalInfo.description}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {caregiver.professionalInfo.specializations.slice(0, 2).map((spec, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                  {caregiver.professionalInfo.specializations.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{caregiver.professionalInfo.specializations.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>₹{caregiver.pricing.hourly}/hr</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ₹{caregiver.pricing.daily}/day • ₹{caregiver.pricing.weekly}/week
                    </div>
                  </div>
                  {caregiver.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleBookCaregiver(caregiver.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCaregivers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No caregivers found matching your criteria</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>
      )}

      {selectedCaregiver && (
        <BookingModal
          caregiverId={selectedCaregiver}
          onClose={() => setSelectedCaregiver(null)}
        />
      )}
    </div>
  );
};

export default CaregiverSearch;