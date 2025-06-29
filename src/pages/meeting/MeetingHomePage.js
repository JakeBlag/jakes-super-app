import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlusSquare, FaBook, FaUserCog } from 'react-icons/fa';

function MeetingHomePage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Meeting Minutes Hub</h2>
      <p>What would you like to do?</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '50px', justifyItems: 'center', alignItems: 'center', maxWidth: 700, margin: '30px auto 0 auto' }}>
        <Link to="/meeting-minutes/new" style={{ textDecoration: 'none', color: 'inherit', width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FaPlusSquare size={70} />
          <p>Start New Minutes</p>
        </Link>
        <Link to="/meeting-minutes/past" style={{ textDecoration: 'none', color: 'inherit', width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FaBook size={70} />
          <p>View Past Minutes</p>
        </Link>
        <Link to="/meeting-minutes/settings" style={{ textDecoration: 'none', color: 'inherit', width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FaUserCog size={70} />
          <p>Settings</p>
        </Link>
      </div>
      <div style={{ marginTop: '50px' }}>
        <Link to="/" className="fancy-button">Back to SuperApp Home</Link>
      </div>
    </div>
  );
}

export default MeetingHomePage; 