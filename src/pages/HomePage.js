import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalculator, FaTasks, FaClipboardList } from 'react-icons/fa';

function HomePage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to Jake's SuperApp!</h1>
      <p>Please select an application to start:</p>
      <nav>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '30px' }}>
          <Link to="/calculator" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaCalculator size={70} />
            <p>Calculator</p>
          </Link>
          <Link to="/todolist" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaTasks size={70} />
            <p>To-Do List</p>
          </Link>
          <Link to="/meeting-minutes" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaClipboardList size={70} />
            <p>Meeting Minutes</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default HomePage; 