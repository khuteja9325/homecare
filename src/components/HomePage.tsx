import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Baby, Activity, Users as UserNurse, ArrowRight } from 'lucide-react';
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const images = [
  'src/public/nursing_hero.svg',
  'src/public/babysitting_hero.svg',
  'src/public/physiotherapy_hero.svg',
];

const HomePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const bgImageStyle = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${images[currentImageIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 1s ease-in-out',
  };

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

  const analyticsData = [
    {
      label: "India's Leading",
      title: "Home Health Care Brand",
    },
    {
      label: "10000+",
      title: "Bookings",
    },
    {
      label: "500+",
      title: "Verified Caregivers",
    },
    {
      label: "1000+",
      title: "Registered Customers",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" 
        style={bgImageStyle}
      >
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-7xl font-bold text-gray-900 mb-6">
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

      <hr className="my-16 border-gray-200" />

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

      <hr className="my-16 border-gray-200" />

      {/* Analytics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Platform in Numbers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {analyticsData.map((item, index) => (
              <div key={index} className="flex flex-col items-center p-8 text-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {index === 0 && <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M12 12c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z" /></>}
                    {index === 1 && <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M16 12H8v2h8zm0 4H8v2h8zm-4-8h-2V6h2z" /></>}
                    {index === 2 && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2.82 9.29c.39-.39 1.02-.39 1.41 0L12 12.59l1.41-1.41c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-2 2c-.39.39-1.02.39-1.41 0l-2-2c-.39-.39-.39-1.02 0-1.41zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>}
                    {index === 3 && <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z" /></>}
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">{item.label}</h4>
                <p className="text-md text-gray-600 font-medium">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />
      
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
              to="/caregiver/auth"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors font-semibold inline-flex items-center justify-center"
            >
              Become a Caregiver
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-7 w-7 text-blue-400" />
              <span className="text-2xl font-bold text-white">CareConnect</span>
            </div>
            <p className="text-gray-400">
              Trusted healthcare services at your doorstep
            </p>
          </div>

          {/* Grid Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">About Us</h3>
              <p className="text-gray-400 text-sm">
                CareConnect bridges patients with qualified healthcare 
                professionals, ensuring safe and timely care at home.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Home Nursing</a></li>
                <li><a href="#" className="hover:text-white">Physiotherapy</a></li>
                <li><a href="#" className="hover:text-white">Elderly Care</a></li>
                <li><a href="#" className="hover:text-white">Maternity Care</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: support@careconnect.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Location: Pune, India</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} CareConnect. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-5 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;