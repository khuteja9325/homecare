import React, { useState } from 'react';
import { Heart, Baby, Users as UserNurse, Activity, CheckCircle, AlertCircle, Upload, User, Lock, Mail, Phone, Calendar, GraduationCap, MapPin, FileText } from 'lucide-react';

interface ServiceModule {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requirements: string[];
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
    professionalId: string; // NUID for nurses, physiotherapist ID, etc.
    policeVerification: File | null; // For babysitting and postnatal
  };
  assessment: {
    completed: boolean;
    score: number;
  };
}

const serviceModules: ServiceModule[] = [
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
    requirements: ['Valid Physiotherapist ID', 'BPT/MPT qualification', 'License certificate']
  },
  {
    id: 'postnatal',
    name: 'Postnatal Service',
    icon: Heart,
    description: 'Specialized care for new mothers and babies',
    requirements: ['Police verification', 'Basic assessment', 'Relevant training certificate']
  },
  {
    id: 'babysitting',
    name: 'Babysitting',
    icon: Baby,
    description: 'Childcare services for families',
    requirements: ['Police verification', 'Basic assessment', 'Child care training']
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'profile'>('home');
  const [selectedService, setSelectedService] = useState<string>('');
  const [registrationStep, setRegistrationStep] = useState<number>(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    serviceType: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      age: '',
      address: '',
      qualification: '',
      experience: ''
    },
    credentials: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    documents: {
      aadhaarCard: null,
      panCard: null,
      professionalId: '',
      policeVerification: null
    },
    assessment: {
      completed: false,
      score: 0
    }
  });
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setRegistrationData(prev => ({ ...prev, serviceType: serviceId }));
    setCurrentView('register');
    setRegistrationStep(1);
  };

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStep(2);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationData.credentials.password !== registrationData.credentials.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setRegistrationStep(3);
  };

  const handleDocumentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStep(4);
  };

  const simulateVerification = () => {
    setVerificationStatus('pending');
    // Simulate API call for verification
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // 70% success rate for demo
      setVerificationStatus(isValid ? 'success' : 'failed');
      if (isValid) {
        setTimeout(() => {
          setCurrentView('profile');
        }, 2000);
      }
    }, 3000);
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CareConnect</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Quality Healthcare
            <span className="text-blue-600 block">At Your Doorstep</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with verified healthcare professionals for nursing care, physiotherapy, 
            postnatal services, and babysitting. Join our trusted network of caregivers.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Register as a Caregiver
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceModules.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">{service.name}</h4>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="space-y-2 mb-8">
                    {service.requirements.map((req, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {req}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleServiceSelect(service.id)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
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

  const renderRegistration = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
          >
            ← Back to Home
          </button>
          <h2 className="text-3xl font-bold text-gray-900">
            Register as {serviceModules.find(s => s.id === selectedService)?.name}
          </h2>
          <p className="text-gray-600 mt-2">Step {registrationStep} of 4</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{Math.round((registrationStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(registrationStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {registrationStep === 1 && (
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.personalInfo.fullName}
                    onChange={(e) => setRegistrationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={registrationData.personalInfo.email}
                    onChange={(e) => setRegistrationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={registrationData.personalInfo.phone}
                    onChange={(e) => setRegistrationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="65"
                    value={registrationData.personalInfo.age}
                    onChange={(e) => setRegistrationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, age: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={registrationData.personalInfo.address}
                  onChange={(e) => setRegistrationData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, address: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline h-4 w-4 mr-1" />
                    Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.personalInfo.qualification}
                    onChange={(e) => setRegistrationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, qualification: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={registrationData.personalInfo.experience}
                    onChange={(e) => setRegistrationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, experience: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Next Step →
              </button>
            </form>
          )}

          {registrationStep === 2 && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Credentials</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={registrationData.credentials.username}
                  onChange={(e) => setRegistrationData(prev => ({
                    ...prev,
                    credentials: { ...prev.credentials, username: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={registrationData.credentials.password}
                  onChange={(e) => setRegistrationData(prev => ({
                    ...prev,
                    credentials: { ...prev.credentials, password: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={registrationData.credentials.confirmPassword}
                  onChange={(e) => setRegistrationData(prev => ({
                    ...prev,
                    credentials: { ...prev.credentials, confirmPassword: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setRegistrationStep(1)}
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
          )}

          {registrationStep === 3 && (
            <form onSubmit={handleDocumentUpload} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Document Verification</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Aadhaar Card *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-1" />
                    PAN Card *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedService === 'nursing' && 'NUID Number *'}
                    {selectedService === 'physiotherapy' && 'Physiotherapist ID *'}
                    {(selectedService === 'babysitting' || selectedService === 'postnatal') && 'Professional Reference'}
                  </label>
                  <input
                    type="text"
                    required={selectedService === 'nursing' || selectedService === 'physiotherapy'}
                    value={registrationData.documents.professionalId}
                    onChange={(e) => setRegistrationData(prev => ({
                      ...prev,
                      documents: { ...prev.documents, professionalId: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      selectedService === 'nursing' ? 'Enter your NUID number' :
                      selectedService === 'physiotherapy' ? 'Enter your Physiotherapist ID' :
                      'Enter reference details'
                    }
                  />
                </div>
                
                {(selectedService === 'babysitting' || selectedService === 'postnatal') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline h-4 w-4 mr-1" />
                      Police Verification Certificate *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setRegistrationStep(2)}
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
          )}

          {registrationStep === 4 && (
            <div className="text-center space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Verification & Assessment</h3>
              
              {verificationStatus === null && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Ready for Verification</h4>
                    <p className="text-blue-700 text-sm">
                      We will now verify your documents and professional credentials. 
                      {(selectedService === 'babysitting' || selectedService === 'postnatal') && 
                        ' You will also need to complete a basic assessment.'
                      }
                    </p>
                  </div>
                  
                  <button
                    onClick={simulateVerification}
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Start Verification Process
                  </button>
                </div>
              )}
              
              {verificationStatus === 'pending' && (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600">Verifying your credentials...</p>
                </div>
              )}
              
              {verificationStatus === 'success' && (
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h4 className="text-xl font-semibold text-green-700">Verification Successful!</h4>
                  <p className="text-gray-600">
                    Welcome to CareConnect! You can now create your professional profile.
                  </p>
                </div>
              )}
              
              {verificationStatus === 'failed' && (
                <div className="space-y-4">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <h4 className="text-xl font-semibold text-red-700">Verification Failed</h4>
                  <p className="text-gray-600">
                    {selectedService === 'nursing' && 'NUID number does not match our database.'}
                    {selectedService === 'physiotherapy' && 'Physiotherapist ID does not match our database.'}
                    {(selectedService === 'babysitting' || selectedService === 'postnatal') && 
                      'Document verification failed or assessment not completed.'
                    }
                  </p>
                  <button
                    onClick={() => {
                      setVerificationStatus(null);
                      setRegistrationStep(3);
                    }}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {verificationStatus !== 'failed' && (
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setRegistrationStep(3)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    disabled={verificationStatus === 'pending'}
                  >
                    ← Previous
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-8 text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to CareConnect!</h2>
            <p className="text-blue-100 mt-2">Your registration has been approved</p>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {registrationData.personalInfo.fullName}
              </h3>
              <p className="text-gray-600">
                {serviceModules.find(s => s.id === selectedService)?.name} Professional
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <p className="text-gray-600 text-sm">Email: {registrationData.personalInfo.email}</p>
                <p className="text-gray-600 text-sm">Phone: {registrationData.personalInfo.phone}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Professional Details</h4>
                <p className="text-gray-600 text-sm">Qualification: {registrationData.personalInfo.qualification}</p>
                <p className="text-gray-600 text-sm">Experience: {registrationData.personalInfo.experience} years</p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                You can now start accepting appointments and managing your services.
              </p>
              <div className="space-x-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Complete Profile Setup
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {currentView === 'home' && renderHome()}
      {currentView === 'register' && renderRegistration()}
      {currentView === 'profile' && renderProfile()}
    </div>
  );
}

export default App;