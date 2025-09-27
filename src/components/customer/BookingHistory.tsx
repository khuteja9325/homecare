import React, { useState } from 'react';
import { Calendar, Star, MapPin, Clock, CreditCard, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const BookingHistory: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const { user } = useAuth();
  const { getBookingsByUserId, updateBooking, getCaregiverById } = useData();

  const bookings = getBookingsByUserId(user?.id || '', 'customer');

  const handleCancelBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: 'cancelled' });
    setShowCancelModal(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
        <p className="text-gray-600">
          You haven't made any bookings yet. Start by searching for caregivers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {bookings.map((booking) => {
            const caregiver = getCaregiverById(booking.caregiverId);
            return (
              <div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 mr-3">
                        {booking.caregiverName}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{booking.startDate} to {booking.endDate}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="capitalize">{booking.serviceType}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>₹{booking.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {booking.serviceDetails && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Details:</strong> {booking.serviceDetails}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedBooking(booking.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => setShowCancelModal(booking.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(showCancelModal)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;