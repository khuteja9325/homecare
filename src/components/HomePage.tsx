import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Baby, Activity, Users as UserNurse, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const services = [
    {
      id: 'nursing',
      name: 'Nursing Care',
      icon: UserNurse,
      description: 'Professional nursing services for home healthcare',
      features: ['24/7 Care', 'Medication Management', 'Health Monitoring']
    },
    {
      id: 'physiotherapy',
      name: 'Physiotherapy',
      icon: Activity,
      description: 'Physical therapy and rehabilitation services',
      features: ['Recovery Support', 'Exercise Therapy', 'Pain Management']
    },
    {
      id: 'postnatal',
      name: 'Postnatal Care',
      icon: Heart,
      description: 'Specialized care for new mothers and babies',
      features: ['Mother Care', 'Baby Care', 'Breastfeeding Support']
    },
    {
      id: 'babysitting',
      name: 'Babysitting',
      icon: Baby,
      description: 'Professional childcare services',
      features: ['Child Safety', 'Educational Activities', 'Flexible Hours']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Quality Healthcare
            <span className="text-blue-600 block">At Your Doorstep</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with verified healthcare professionals for nursing care, physiotherapy, 
            postnatal services, and babysitting. Trusted care when you need it most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/customer/auth"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Find Caregivers
            </Link>
            <Link
              to="/caregiver/auth"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Join as Caregiver
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Healthcare Services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">{service.name}</h4>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="space-y-2 mb-8">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Whether you need care or want to provide care, we're here to help you connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/customer/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-flex items-center justify-center"
            >
              Book a Caregiver
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/caregiver/register"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors font-semibold inline-flex items-center justify-center"
            >
              Become a Caregiver
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-semibold">CareConnect</span>
          </div>
          <p className="text-gray-400">
            Trusted healthcare services at your doorstep
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;