import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // ⚠️ New State for error messages
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(''); // Clear error when user starts typing again

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const isPasswordStrong = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      setErrorMessage("Please meet all password requirements.");
      return;
    }

    try {
      // Backend request with unique email check
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      // 🛡️ Error handling for duplicate emails or server issues
      const msg = error.response?.data?.message || "Registration failed";
      console.error("❌ Registration failed:", msg);
      setErrorMessage(msg); // Page reload ki jagah error message dikhayein
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>

      {/* 🔴 Display Error Message if email exists or validation fails */}
      {errorMessage && (
        <div style={{ color: '#e74c3c', backgroundColor: '#fadbd8', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">
        <label htmlFor="name" className="form-label">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="form-label">Create Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          className={isPasswordStrong ? 'green-border' : ''}
          required
        />

        {!isPasswordStrong && (
          <ul className="password-rules">
            <li className={passwordValidations.length ? 'valid' : 'invalid'}>At least 8 characters</li>
            <li className={passwordValidations.upper ? 'valid' : 'invalid'}>At least 1 uppercase letter</li>
            <li className={passwordValidations.lower ? 'valid' : 'invalid'}>At least 1 lowercase letter</li>
            <li className={passwordValidations.number ? 'valid' : 'invalid'}>At least 1 number</li>
            <li className={passwordValidations.special ? 'valid' : 'invalid'}>At least 1 special character (!@#$%^&*)</li>
          </ul>
        )}

        <div className="role-options">
          <label className="form-label">Select Role</label>
          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="buyer"
              checked={formData.role === "buyer"}
              onChange={handleChange}
              required
            />
            Buyer
          </label>
          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="seller"
              checked={formData.role === "seller"}
              onChange={handleChange}
              required
            />
            Seller
          </label>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;