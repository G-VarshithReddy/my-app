import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PayNow.css';
import { getToken } from './utils/auth';

const PayNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('credit');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [netBankingDetails, setNetBankingDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [paypalDetails, setPaypalDetails] = useState({
    email: '',
    password: ''
  });

  const paymentDetails = location.state;

  if (!paymentDetails) {
    return (
      <div className="paynow-container">
        <div className="error-message">
          No payment details found. Please try again.
        </div>
        <button onClick={() => navigate('/events')} className="back-button">
          Back to Events
        </button>
      </div>
    );
  }

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowForm(true);
  };

  const handleInputChange = (e, setterFunction) => {
    const { name, value } = e.target;
    setterFunction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Payment Successful!');
      
      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/customer-dashboard', {
          state: { 
            showPaymentSuccess: true,
            paymentAmount: paymentDetails.amount || paymentDetails.totalAmount
          }
        });
      }, 2000);
    } catch (error) {
      setSuccess('');
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (selectedMethod) {
      case 'credit':
      case 'debit':
        return (
          <form className="card-form" onSubmit={handlePayment}>
            <div className="form-group">
              <label>CARD NAME</label>
              <input
                type="text"
                name="cardName"
                placeholder="Card Holder Name"
                value={cardDetails.cardName}
                onChange={(e) => handleInputChange(e, setCardDetails)}
                required
              />
            </div>
            <div className="form-group">
              <label>CARD NUMBER</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardDetails.cardNumber}
                onChange={(e) => handleInputChange(e, setCardDetails)}
                maxLength="19"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>MONTH / YEAR</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleInputChange(e, setCardDetails)}
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="***"
                  value={cardDetails.cvv}
                  onChange={(e) => handleInputChange(e, setCardDetails)}
                  maxLength="3"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="make-payment-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Make Payment'}
            </button>
          </form>
        );
      case 'netbanking':
        return (
          <form className="card-form" onSubmit={handlePayment}>
            <div className="form-group">
              <label>BANK NAME</label>
              <input
                type="text"
                name="bankName"
                placeholder="Enter Bank Name"
                value={netBankingDetails.bankName}
                onChange={(e) => handleInputChange(e, setNetBankingDetails)}
                required
              />
            </div>
            <div className="form-group">
              <label>ACCOUNT NUMBER</label>
              <input
                type="text"
                name="accountNumber"
                placeholder="Enter Account Number"
                value={netBankingDetails.accountNumber}
                onChange={(e) => handleInputChange(e, setNetBankingDetails)}
                required
              />
            </div>
            <div className="form-group">
              <label>IFSC CODE</label>
              <input
                type="text"
                name="ifscCode"
                placeholder="Enter IFSC Code"
                value={netBankingDetails.ifscCode}
                onChange={(e) => handleInputChange(e, setNetBankingDetails)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="make-payment-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Make Payment'}
            </button>
          </form>
        );
      case 'paypal':
        return (
          <form className="card-form" onSubmit={handlePayment}>
            <div className="form-group">
              <label>PAYPAL EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="Enter PayPal Email"
                value={paypalDetails.email}
                onChange={(e) => handleInputChange(e, setPaypalDetails)}
                required
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                name="password"
                placeholder="Enter PayPal Password"
                value={paypalDetails.password}
                onChange={(e) => handleInputChange(e, setPaypalDetails)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="make-payment-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Make Payment'}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="paynow-container">
      <h2>Select Payment Method</h2>
      
      <div className="total-amount">
        <h3>TOTAL PAY</h3>
        <h2>₹ {paymentDetails.amount || paymentDetails.totalAmount || 0}</h2>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="payment-methods">
        <div 
          className={`payment-method ${selectedMethod === 'credit' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('credit')}
        >
          <img src="/credit-card-icon.png" alt="Credit Card" />
          <p>Credit Card</p>
        </div>
        <div 
          className={`payment-method ${selectedMethod === 'netbanking' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('netbanking')}
        >
          <img src="/netbanking-icon.png" alt="Net Banking" />
          <p>Net Banking</p>
        </div>
        <div 
          className={`payment-method ${selectedMethod === 'paypal' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('paypal')}
        >
          <img src="/paypal-icon.png" alt="PayPal" />
          <p>PayPal</p>
        </div>
        <div 
          className={`payment-method ${selectedMethod === 'debit' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('debit')}
        >
          <img src="/debit-card-icon.png" alt="Debit Card" />
          <p>Debit Card</p>
        </div>
      </div>

      {showForm && renderForm()}
    </div>
  );
};

export default PayNow; 