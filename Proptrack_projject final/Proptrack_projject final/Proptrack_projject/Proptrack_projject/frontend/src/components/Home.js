import React, { useEffect, useState } from 'react';
import './Home.css';
import dreamImage from '../assets/property_image_for_css.jpg';
import buyImage from '../assets/buy.png';     // Replace with your image paths
import sellImage from '../assets/sell.png';
import rentImage from '../assets/rent.jpg';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setIsLoggedIn(true);
      setUserRole(storedUser.role); // assuming the role is stored like { name, email, role }
    }
  }, []);

  const getRedirectPath = () => {
    if (!isLoggedIn) return '/login';
    if (userRole === 'buyer') return '/buy';
    if (userRole === 'seller') return '/sell';
    return '/login'; // default fallback
  };
  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text-left">
          <h1>Welcome to PropTrack</h1>
          <p>
            Discover your dream property with ease and confidence. Buy, sell, or rent with PropTrack today! <br /><br />
            Join thousands of satisfied users who’ve found their perfect property with us. Start your real estate journey today with the platform you can trust.
          </p>
          <a 
            href={getRedirectPath()} 
            className="get-started-btn"
          >
            Get Started
          </a>
        </div>
        <img src={dreamImage} alt="Dream Property" className="hero-img-right" />
      </div>

            {/* Services Section */}
<section className="features">
  <h2 className="services-heading">Our Services</h2>
  <div className="feature-boxes">
    <div className="feature-box">
      <img src={buyImage} alt="Buy Property" className="feature-img" />
      <h3 className="feature-title">Buy Property</h3>
      <p className="feature-desc">Explore a wide range of properties to buy and make smart investments.</p>
    </div>
    <div className="feature-box">
      <img src={sellImage} alt="Sell Property" className="feature-img" />
      <h3 className="feature-title">Sell Property</h3>
      <p className="feature-desc">Post your property listings and reach potential buyers easily.</p>
    </div>
    <div className="feature-box">
      <img src={rentImage} alt="Rent Property" className="feature-img" />
      <h3 className="feature-title">Rent Property</h3>
      <p className="feature-desc">Find or list rental homes with ease and convenience.</p>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} PropTrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
