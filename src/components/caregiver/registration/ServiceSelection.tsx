import React from 'react';
import { Users as UserNurse, Activity, Heart, Baby } from 'lucide-react';
import { RegistrationData } from '../CaregiverRegistration';

interface ServiceSelectionProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ data, updateData, onNext }) => {
  const services = [
    {
      id: 'nursing',
      name: 'Nursing Care',
      icon: UserNurse,
      description: 'Professional nursing services for home healthcare',
      requirements: ['Valid NUID', 'Nursing qualification', 'Experience certificate']
    },
    {
      id: 'physiotherapy',
      name: 'Physiotherapy',
      icon: Activity,
      description: 'Physical therapy and rehabilitation services',
      requirements: ['Valid IAP Membership ID', 'BPT/MPT qualification', 'License certificate']
    },
    {
      id: 'postnatal',
      name: 'Postnatal Care',
      icon: Heart,
      description: 'Specialized care for new mothers and babies',
      requirements: ['Police verification', 'Basic assessment', 'Relevant training certificate']
    },
    {
      id: 'babysitting',
      name: 'Babysitting',
      icon: Baby,
      description: 'Professional childcare services',
      requirements: ['Police verification', 'Basic assessment', 'Child care training']
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    updateData({ serviceType: serviceId });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Select Your Service Category
        </h3>
        <p className="text-gray-600">
          Choose the healthcare service you want to provide
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              data.serviceType === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleServiceSelect(service.id)}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <service.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h4>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Requirements:</p>
                {service.requirements.map((req, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {req}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;