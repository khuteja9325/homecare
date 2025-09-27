import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { RegistrationData } from '../CaregiverRegistration';

interface PaymentStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: ''
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        updateData({
          payment: {
            completed: true,
            amount: 500,
            transactionId: `TXN${Date.now()}`
          }
        });
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  const handleNext = () => {
    if (data.payment.completed) {
      onNext();
    }
  };

  if (data.payment.completed) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h4 className="text-xl font-semibold text-green-700">Payment Successful!</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">
              Registration fee of ₹500 has been paid successfully.
            </p>
            <p className="text-green-600 text-xs mt-1">
              Transaction ID: {data.payment.transactionId}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onPrevious}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Create Profile →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Registration Payment
        </h3>
        <p className="text-gray-600">
          Complete your registration with a one-time payment of ₹500
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-blue-900">Registration Fee</span>
          <span className="text-2xl font-bold text-blue-900">₹500</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          This fee covers document verification, profile setup, and platform access.
        </p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Credit/Debit Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                paymentMethod === 'upi'
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

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                required
                value={paymentForm.cardholderName}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter cardholder name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                required
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.expiryDate}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.cvv}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID *
            </label>
            <input
              type="text"
              required
              value={paymentForm.upiId}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, upiId: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="yourname@upi"
            />
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onPrevious}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            disabled={isProcessing}
          >
            ← Previous
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay ₹500`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentStep;