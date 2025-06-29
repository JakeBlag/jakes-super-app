import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function PastMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('meetings')) || [];
    setMeetings(saved);
  }, []);

  return (
    <div style={{ width: '90%', maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ marginBottom: 24 }}>Past Meeting Minutes</h2>
      {meetings.length === 0 ? (
        <p>No past meetings have been saved.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ background: '#f4f7fa', color: '#005a9e' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Title</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Venue</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Chair</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700 }}>Actions</th>
                <th style={{ padding: '12px 8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(meeting => {
                // Count total actions in agenda and subheadings
                let actionCount = 0;
                if (Array.isArray(meeting.agenda)) {
                  meeting.agenda.forEach(item => {
                    if (Array.isArray(item.actions)) actionCount += item.actions.length;
                    if (Array.isArray(item.subheadings)) {
                      item.subheadings.forEach(sub => {
                        if (Array.isArray(sub.actions)) actionCount += sub.actions.length;
                      });
                    }
                  });
                }
                return (
                  <tr key={meeting.id} style={{ borderBottom: '1.5px solid #e0e6ed' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 600, color: '#555'  }}>{meeting.meetingTitle || 'Untitled Meeting'}</td>
                    <td style={{ padding: '10px 8px', color: '#555' }}>{meeting.date || '-'}</td>
                    <td style={{ padding: '10px 8px', color: '#555' }}>{meeting.venue || '-'}</td>
                    <td style={{ padding: '10px 8px', color: '#555' }}>{meeting.chairedBy || '-'}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#005a9e', fontWeight: 700 }}>{actionCount}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <button className="fancy-button" style={{ padding: '6px 18px', fontSize: 15 }} onClick={() => navigate(`/meeting-minutes/past/${meeting.id}`)}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ marginTop: '30px' }}>
        <Link to="/meeting-minutes" className="fancy-button">Back to Meeting Hub</Link>
      </div>
    </div>
  );
}

export default PastMeetingsPage; 