import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, CreditCard, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

interface BookingModalProps {
  caregiverId: string;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ caregiverId, onClose }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    duration: 'daily',
    serviceDetails: '',
    paymentMethod: 'card'
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const { getCaregiverById, addBooking } = useData();
  const { user } = useAuth();
  const caregiver = getCaregiverById(caregiverId);

  if (!caregiver) return null;

  const calculateTotal = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    switch (bookingData.duration) {
      case 'hourly':
        return days * 8 * caregiver.pricing.hourly; // Assuming 8 hours per day
      case 'daily':
        return days * caregiver.pricing.daily;
      case 'weekly':
        return Math.ceil(days / 7) * caregiver.pricing.weekly;
      default:
        return 0;
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const booking = {
        id: `booking_${Date.now()}`,
        customerId: user?.id || '',
        caregiverId: caregiverId,
        serviceType: caregiver.serviceType,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        duration: bookingData.duration,
        totalAmount: calculateTotal(),
        status: 'pending' as const,
        paymentStatus: 'paid' as const,
        customerName: user?.fullName || '',
        caregiverName: caregiver.personalInfo.fullName,
        serviceDetails: bookingData.serviceDetails
      };

      addBooking(booking);
      setPaymentProcessing(false);
      setBookingConfirmed(true);
    }, 2000);
  };

  const handleClose = () => {
    if (bookingConfirmed) {
      window.location.reload(); // Refresh to show new booking
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {bookingConfirmed ? 'Booking Confirmed!' : 'Book Caregiver'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {bookingConfirmed ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold text-green-700">
                Your booking has been confirmed!
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm">
                  <strong>{caregiver.personalInfo.fullName}</strong> will contact you shortly to confirm the details.
                </p>
                <p className="text-green-600 text-xs mt-2">
                  You can track your booking status in the "My Bookings" section.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Caregiver Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
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
                    <p className="text-sm text-gray-500">{caregiver.personalInfo.address}</p>
                  </div>
                </div>
              </div>

              {step === 1 && (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        End Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.endDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Service Duration *
                    </label>
                    <select
                      value={bookingData.duration}
                      onChange={(e) => setBookingData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hourly">Hourly (₹{caregiver.pricing.hourly}/hour)</option>
                      <option value="daily">Daily (₹{caregiver.pricing.daily}/day)</option>
                      <option value="weekly">Weekly (₹{caregiver.pricing.weekly}/week)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Details
                    </label>
                    <textarea
                      rows={3}
                      value={bookingData.serviceDetails}
                      onChange={(e) => setBookingData(prev => ({ ...prev, serviceDetails: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your specific requirements..."
                    />
                  </div>

                  {bookingData.startDate && bookingData.endDate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-900">Total Amount</span>
                        <span className="text-2xl font-bold text-blue-900">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Proceed to Payment
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="capitalize">{caregiver.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{bookingData.startDate} to {bookingData.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span className="capitalize">{bookingData.duration}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'card' }))}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          bookingData.paymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Credit/Debit Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          bookingData.paymentMethod === 'upi'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="h-6 w-6 mx-auto mb-2 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                          UPI
                        </div>
                        <span className="text-sm font-medium">UPI Payment</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      disabled={paymentProcessing}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={paymentProcessing}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {paymentProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Pay ₹${calculateTotal().toLocaleString()}`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;