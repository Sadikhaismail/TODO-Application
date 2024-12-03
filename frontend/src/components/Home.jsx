import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="home-title">Welcome to the TODO Application</h1>
        <p className="home-description">Every task you complete brings you one step closer to your goal. Stay focused and keep progressing!</p>
        <p className="home-call-to-action">
          <span className="bold-text">Register</span> or <span className="bold-text">Login</span> to begin your journey.
        </p>

        <div className="home-buttons">
          <Link to="/login">
            <button className="home-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="home-button">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;