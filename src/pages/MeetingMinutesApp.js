import React, { useState } from 'react';
import '../pages/meeting/MeetingForm.css';

function Collapsible({ title, children, isOpen, onToggle }) {
  return (
    <div className="form-card">
      <div className="card-header" style={{ cursor: 'pointer' }} onClick={onToggle}>
        {isOpen ? '▼' : '►'} {title}
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

function MeetingMinutesApp() {
  const [attendees, setAttendees] = useState('');
  const [agenda, setAgenda] = useState([]);
  const [openAgendaIndex, setOpenAgendaIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState({});

  const today = new Date().toLocaleDateString();

  // Agenda item: { title: string, subheadings: [{ title: string, actions: string }] }

  const addAgendaItem = () => {
    setAgenda([...agenda, { title: '', subheadings: [] }]);
  };

  const updateAgendaTitle = (idx, value) => {
    const newAgenda = [...agenda];
    newAgenda[idx].title = value;
    setAgenda(newAgenda);
  };

  const removeAgendaItem = (idx) => {
    setAgenda(agenda.filter((_, i) => i !== idx));
    setOpenAgendaIndex(null);
  };

  const addSubheading = (agendaIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings.push({ title: '', actions: '' });
    setAgenda(newAgenda);
  };

  const updateSubheadingTitle = (agendaIdx, subIdx, value) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings[subIdx].title = value;
    setAgenda(newAgenda);
  };

  const updateSubheadingActions = (agendaIdx, subIdx, value) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings[subIdx].actions = value;
    setAgenda(newAgenda);
  };

  const removeSubheading = (agendaIdx, subIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings.splice(subIdx, 1);
    setAgenda(newAgenda);
    setOpenSubIndex((prev) => ({ ...prev, [agendaIdx]: null }));
  };

  return (
    <div className="meeting-form-container">
      <h2>Engineering Tier 2 Meeting Minutes</h2>
      <h3>Date: {today}</h3>

      <div className="form-card">
        <label htmlFor="attendees"><h4>Attendees:</h4></label>
        <textarea
          id="attendees"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          className="modern-textarea"
          style={{ width: '100%', minHeight: '80px', fontSize: '16px' }}
        />
      </div>

      <div className="form-card">
        <div className="card-header">Agenda Items</div>
        <button type="button" onClick={addAgendaItem} style={{ marginBottom: 10 }}>
          + Add Agenda Item
        </button>
        {agenda.map((item, idx) => (
          <Collapsible
            key={idx}
            title={item.title || `Agenda Item ${idx + 1}`}
            isOpen={openAgendaIndex === idx}
            onToggle={() => setOpenAgendaIndex(openAgendaIndex === idx ? null : idx)}
          >
            <input
              className="modern-input"
              type="text"
              placeholder="Agenda Title"
              value={item.title}
              onChange={e => updateAgendaTitle(idx, e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <button type="button" onClick={() => addSubheading(idx)} style={{ marginBottom: 10 }}>
              + Add Subheading
            </button>
            <button type="button" onClick={() => removeAgendaItem(idx)} style={{ marginLeft: 10, color: 'red' }}>
              Remove Agenda
            </button>
            {item.subheadings.map((sub, subIdx) => (
              <Collapsible
                key={subIdx}
                title={sub.title || `Subheading ${subIdx + 1}`}
                isOpen={openSubIndex[idx] === subIdx}
                onToggle={() => setOpenSubIndex(prev => ({ ...prev, [idx]: prev[idx] === subIdx ? null : subIdx }))}
              >
                <input
                  className="modern-input"
                  type="text"
                  placeholder="Subheading Title"
                  value={sub.title}
                  onChange={e => updateSubheadingTitle(idx, subIdx, e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <textarea
                  className="modern-textarea"
                  placeholder="Actions/Notes for this subheading"
                  value={sub.actions}
                  onChange={e => updateSubheadingActions(idx, subIdx, e.target.value)}
                  style={{ width: '100%', minHeight: '60px', fontSize: '15px' }}
                />
                <button type="button" onClick={() => removeSubheading(idx, subIdx)} style={{ color: 'red', marginTop: 5 }}>
                  Remove Subheading
                </button>
              </Collapsible>
            ))}
          </Collapsible>
        ))}
      </div>

      <button className="modern-input" style={{ width: '200px', margin: '20px auto', display: 'block' }} onClick={() => alert('Minutes Saved (not really!)')}>
        Save Minutes
      </button>
    </div>
  );
}

export default MeetingMinutesApp; 