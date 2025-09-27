import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Clock, Calendar, CreditCard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import CaregiverSearch from './CaregiverSearch';
import BookingHistory from './BookingHistory';
import ProfileSetup from './ProfileSetup';

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const { user } = useAuth();
  const { getBookingsByUserId } = useData();

  const bookings = getBookingsByUserId(user?.id || '', 'customer');
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Upcoming',
      value: upcomingBookings.length,
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'Completed',
      value: completedBookings.length,
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Spent',
      value: `₹${completedBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-orange-500'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {upcomingBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.caregiverName}</p>
                    <p className="text-sm text-gray-600">{booking.serviceType} • {booking.startDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{booking.totalAmount}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'search', name: 'Find Caregivers', icon: Search },
    { id: 'bookings', name: 'My Bookings', icon: Calendar },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  if (!user?.profileComplete) {
    return <ProfileSetup />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Find trusted caregivers for your healthcare needs
          </p>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'search' && <CaregiverSearch />}
          {activeTab === 'bookings' && <BookingHistory />}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
              <p className="text-gray-600">Profile management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;