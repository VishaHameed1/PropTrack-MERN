import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1
import './Login.css';

const Login = () => {
  const navigate = useNavigate(); // ✅ Step 2

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // alert("🟢 Login successful: " + data.message);
        // console.log("Login Response:", data);

        // Save user info if needed (optional)
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ Step 3: Redirect based on role
        if (formData.role === 'buyer') {
          navigate('/buy');
        } else if (formData.role === 'seller') {
          navigate('/sell');
        }
      } else {
        alert("🔴 Error: " + data.message);
      }
    }
   catch (error) {
      // console.error("❌ Login request failed:", error);
      // alert("❌ Server error during login");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="login-form">
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

        <label htmlFor="password" className="form-label">Enter Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="role-options">
          <p className="form-label">Select Role</p>
          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="buyer"
              checked={formData.role === 'buyer'}
              onChange={handleChange}
            />
            Buyer
          </label>
          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="seller"
              checked={formData.role === 'seller'}
              onChange={handleChange}
            />
            Seller
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;