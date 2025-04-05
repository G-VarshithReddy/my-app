import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VenuePayNow.css';

const VenuePayNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    // Credit/Debit Card
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    // Net Banking
    bank: '',
    accountNumber: '',
    ifscCode: '',
    // PayPal
    email: '',
    password: ''
  });
  const bookingData = location.state?.bookingData;

  const paymentMethods = [
    { id: 'credit', name: 'Credit Card', image: 'credit-card.png' },
    { id: 'netbanking', name: 'Net Banking', image: 'net-banking.png' },
    { id: 'paypal', name: 'PayPal', image: 'paypal.png' },
    { id: 'debit', name: 'Debit Card', image: 'debit-card.png' }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    // Reset form data when switching payment methods
    setFormData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      bank: '',
      accountNumber: '',
      ifscCode: '',
      email: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      // Show success message in the page
      setSuccessMessage('Payment successful! Your venue has been booked.');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings', {
          state: {
            message: 'Payment successful! Your venue has been booked.',
            paymentDetails: {
              amount: bookingData?.totalPrice,
              method: selectedMethod,
              bookingId: bookingData?.bookingId
            }
          }
        });
      }, 2000);
    }, 2000);
  };

  const renderPaymentForm = () => {
    switch(selectedMethod) {
      case 'credit':
      case 'debit':
        return (
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                required
              />
            </div>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group half">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="process-payment-button"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        );

      case 'netbanking':
        return (
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="form-group">
              <label>Select Bank</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                required
              />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                placeholder="Enter IFSC code"
                required
              />
            </div>
            <button 
              type="submit" 
              className="process-payment-button"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        );

      case 'paypal':
        return (
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="form-group">
              <label>PayPal Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your PayPal email"
                required
              />
            </div>
            <div className="form-group">
              <label>PayPal Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your PayPal password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="process-payment-button"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  if (!bookingData) {
    return (
      <div className="venue-paynow-container">
        <div className="error-message">
          No payment information found.
          <button 
            onClick={() => navigate('/venues')} 
            className="back-button"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-paynow-container">
      <h2>Select Payment Method</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="total-amount">
        <h3>TOTAL PAY</h3>
        <div className="amount">₹ {bookingData.totalPrice}</div>
      </div>

      <div className="payment-methods-container">
        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <img 
                src={`/payment-icons/${method.image}`} 
                alt={method.name}
                className="payment-icon"
              />
              <span>{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedMethod && renderPaymentForm()}
    </div>
  );
};

export default VenuePayNow; 