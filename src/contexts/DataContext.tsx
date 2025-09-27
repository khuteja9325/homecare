import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CaregiverProfile {
  id: string;
  userId: string;
  serviceType: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    age: string;
    address: string;
    profileImage?: string;
  };
  professionalInfo: {
    qualification: string;
    experience: string;
    specializations: string[];
    languages: string[];
    description: string;
  };
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  availability: {
    days: string[];
    timeSlots: string[];
  };
  ratings: {
    average: number;
    total: number;
  };
  reviews: Review[];
  verified: boolean;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface Booking {
  id: string;
  customerId: string;
  caregiverId: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  customerName: string;
  caregiverName: string;
  serviceDetails: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

interface DataContextType {
  caregivers: CaregiverProfile[];
  customers: CustomerProfile[];
  bookings: Booking[];
  addCaregiver: (caregiver: CaregiverProfile) => void;
  addCustomer: (customer: CustomerProfile) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  getCaregiversByService: (serviceType: string) => CaregiverProfile[];
  getCaregiverById: (id: string) => CaregiverProfile | undefined;
  getBookingsByUserId: (userId: string, userType: 'caregiver' | 'customer') => Booking[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>([
    // Sample data
    {
      id: '1',
      userId: 'cg1',
      serviceType: 'nursing',
      personalInfo: {
        fullName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+91 9876543210',
        age: '28',
        address: 'Mumbai, Maharashtra'
      },
      professionalInfo: {
        qualification: 'BSc Nursing',
        experience: '5',
        specializations: ['ICU Care', 'Post-operative Care'],
        languages: ['English', 'Hindi'],
        description: 'Experienced nurse with expertise in critical care and patient rehabilitation.'
      },
      pricing: {
        hourly: 300,
        daily: 2000,
        weekly: 12000
      },
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['Morning', 'Evening']
      },
      ratings: {
        average: 4.8,
        total: 24
      },
      reviews: [
        {
          id: '1',
          customerId: 'c1',
          customerName: 'Rajesh Kumar',
          rating: 5,
          comment: 'Excellent care provided to my mother. Very professional and caring.',
          date: '2024-01-15'
        }
      ],
      verified: true
    }
  ]);

  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addCaregiver = (caregiver: CaregiverProfile) => {
    setCaregivers(prev => [...prev, caregiver]);
  };

  const addCustomer = (customer: CustomerProfile) => {
    setCustomers(prev => [...prev, customer]);
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, ...updates } : booking
    ));
  };

  const getCaregiversByService = (serviceType: string) => {
    return caregivers.filter(caregiver => caregiver.serviceType === serviceType);
  };

  const getCaregiverById = (id: string) => {
    return caregivers.find(caregiver => caregiver.id === id);
  };

  const getBookingsByUserId = (userId: string, userType: 'caregiver' | 'customer') => {
    if (userType === 'caregiver') {
      return bookings.filter(booking => booking.caregiverId === userId);
    } else {
      return bookings.filter(booking => booking.customerId === userId);
    }
  };

  return (
    <DataContext.Provider value={{
      caregivers,
      customers,
      bookings,
      addCaregiver,
      addCustomer,
      addBooking,
      updateBooking,
      getCaregiversByService,
      getCaregiverById,
      getBookingsByUserId
    }}>
      {children}
    </DataContext.Provider>
  );
};