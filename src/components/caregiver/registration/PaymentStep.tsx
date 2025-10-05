import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// FIX: Changed '../' to '../../' to access CaregiverRegistration from the 'registration' sub-folder
import { RegistrationData } from '../CaregiverRegistration';

interface PaymentStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  // Note: onNext is redundant if this is the final step, but kept for flow
  onNext: () => void; 
  onPrevious: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  // NEW: State to hold user-facing error messages
  const [paymentError, setPaymentError] = useState<string | null>(null); 
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: ''
  });

  const isFormValid = (paymentMethod === 'card' && 
    paymentForm.cardNumber.replace(/\s/g, '').length === 16 && // Check for 16 digits regardless of spaces
    paymentForm.expiryDate.length === 5 && 
    paymentForm.cvv.length === 3 && 
    paymentForm.cardholderName.trim() !== '') || 
    (paymentMethod === 'upi' && paymentForm.upiId.trim() !== '');

  // NEW: Handler for Card Number formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
    // ENHANCEMENT: Explicitly limit length in state to 19 (16 digits + 3 spaces)
    setPaymentForm(prev => ({ ...prev, cardNumber: value.substring(0, 19) })); 
  };

  // NEW: Handler for Expiry Date formatting
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Logic to reconstruct MM/YY format
    if (value.length >= 2) {
        // Limit month to 2 digits
        const month = value.substring(0, 2);
        // Limit year to 2 digits
        const year = value.substring(2, 4);
        
        // Rebuild value as MM/YY
        value = month;
        if (year.length > 0) {
            value += '/' + year;
        }
    }
    // Limit to MM/YY (5 characters including the '/')
    value = value.substring(0, 5);
    
    setPaymentForm(prev => ({ ...prev, expiryDate: value }));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null); // Clear previous errors
    
    if (!isFormValid) {
        console.error("Please fill in all required fields for the selected payment method.");
        setPaymentError("Please fill in all required fields correctly.");
        return;
    }
    
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // FIX: Setting success to true so the payment step always succeeds.
      const success = true; 
      
      if (success) {
        updateData({
          payment: {
            completed: true,
            amount: 500,
            transactionId: `TXN${Date.now()}`
          },
          isPaymentComplete: true 
        });
      } else {
        // This block will now never run due to `const success = true;`
        console.error("Payment failed. Please try again.");
        // NEW: Set user-facing error message
        setPaymentError("Payment failed. Please verify your payment details and try again.");
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  const handleNext = () => {
    if (data.payment && data.payment.completed) {
      onNext();
    }
  };

  if (data.payment && data.payment.completed) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h4 className="text-xl font-semibold text-green-700">Payment Successful!</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            {/* FIX: Dynamically accessing data.payment.amount in the success message */}
            <p className="text-green-700 text-sm">
              Registration fee of ₹{data.payment.amount} has been paid successfully.
            </p>
            {/* FIX: Using optional chaining for resilience, although the outer if statement should handle the check */}
            <p className="text-green-600 text-xs mt-1">
              Transaction ID: {data.payment?.transactionId}
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
        {/* NEW: Display payment error message */}
        {paymentError && (
          <div className="flex items-start p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3 mt-0.5" />
            <div>
              <span className="font-medium">Error:</span> {paymentError}
            </div>
          </div>
        )}

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
                // UPDATED: Use the new handler for automatic spacing
                onChange={handleCardNumberChange}
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
                  // UPDATED: Use the new handler for automatic slash insertion
                  onChange={handleExpiryDateChange}
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
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ''); // Ensure only digits
                    // ENHANCEMENT: Explicitly enforce max length for state consistency
                    value = value.substring(0, 3); 
                    setPaymentForm(prev => ({ ...prev, cvv: value }))
                  }}
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
            disabled={isProcessing || !isFormValid}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
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
