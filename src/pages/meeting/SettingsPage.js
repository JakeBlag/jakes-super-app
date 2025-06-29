import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCog, FaRegClone, FaTrash } from 'react-icons/fa';

function SettingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [toDelete, setToDelete] = useState({ people: false, templates: false, meetings: false });
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCheckbox = (key) => {
    setToDelete(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleClear = () => {
    setDeleting(true);
    if (toDelete.people) localStorage.removeItem('peopleList');
    if (toDelete.templates) localStorage.removeItem('meetingTemplates');
    if (toDelete.meetings) localStorage.removeItem('meetings');
    setTimeout(() => {
      setDeleting(false);
      setShowModal(false);
      setShowConfirm(false);
      setToDelete({ people: false, templates: false, meetings: false });
    }, 600);
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h2>Settings</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px' }}>
        <Link to="/meeting-minutes/people" className="fancy-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, minWidth: 180 }}>
          <FaUserCog size={50} />
          <span style={{ marginTop: 12 }}>Manage People</span>
        </Link>
        <Link to="/meeting-minutes/templates" className="fancy-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, minWidth: 180 }}>
          <FaRegClone size={50} />
          <span style={{ marginTop: 12 }}>Manage Templates</span>
        </Link>
        <button
          className="fancy-button"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            minWidth: 230,
            minHeight: 104,
            background: '#c0392b',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            height: '100%'
          }}
          onClick={() => setShowModal(true)}
        >
          <FaTrash size={50} />
          <span style={{ marginTop: 12 }}>Clear Data</span>
        </button>
      </div>
      <div style={{ marginTop: '40px' }}>
        <Link to="/meeting-minutes" className="fancy-button">Back to Meeting Hub</Link>
      </div>
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: 'white', borderRadius: 10, padding: 36, minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center', color: '#111' }}>
            <h2 style={{ marginBottom: 18, color: '#111' }}>Clear Data</h2>
            <p style={{ marginBottom: 18, color: '#111' }}>Select which data sets you want to delete. This action cannot be undone.</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0 auto 24px', maxWidth: 250, color: '#111' }}>
              <label style={{ marginBottom: 10, color: '#111' }}>
                <input type="checkbox" checked={toDelete.people} onChange={() => handleCheckbox('people')} />{' '}
                People
              </label>
              <label style={{ marginBottom: 10, color: '#111' }}>
                <input type="checkbox" checked={toDelete.templates} onChange={() => handleCheckbox('templates')} />{' '}
                Templates
              </label>
              <label style={{ marginBottom: 10, color: '#111' }}>
                <input type="checkbox" checked={toDelete.meetings} onChange={() => handleCheckbox('meetings')} />{' '}
                Meetings
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button className="fancy-button" style={{ background: '#c00', color: '#fff', minWidth: 100 }} onClick={handleDeleteClick} disabled={deleting || (!toDelete.people && !toDelete.templates && !toDelete.meetings)}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button className="fancy-button" style={{ background: '#eee', color: '#333', minWidth: 100 }} onClick={() => setShowModal(false)} disabled={deleting}>Cancel</button>
            </div>
            {showConfirm && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ background: 'white', borderRadius: 10, padding: 32, minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center', color: '#111' }}>
                  <h3 style={{ color: '#c00', marginBottom: 16 }}>Are you sure?</h3>
                  <p style={{ marginBottom: 24 }}>You are about to permanently delete the selected data. This action cannot be undone.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <button className="fancy-button" style={{ background: '#c00', color: '#fff', minWidth: 100 }} onClick={handleClear} disabled={deleting}>Yes, Delete</button>
                    <button className="fancy-button" style={{ background: '#eee', color: '#333', minWidth: 100 }} onClick={handleCancelConfirm} disabled={deleting}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage; 