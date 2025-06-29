import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import './MeetingForm.css'; // Import the new styles
import { FaUsers, FaClipboardList, FaInfoCircle } from 'react-icons/fa';

function GhostInput({ value, onChange, onCommit, placeholder, style, className }) {
  return (
    <input
      className={`modern-input ${className || ''}`}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ opacity: 0.5, ...style }}
      onFocus={onCommit}
      onKeyDown={e => {
        if (e.key === 'Enter' && value.trim()) onCommit();
      }}
    />
  );
}

function CollapsibleEditableTitle({ title, onTitleChange, children, isOpen, onToggle, placeholder, onDelete, inputClass }) {
  return (
    <div className="form-card">
      <div className="card-header" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={onToggle}>
        {isOpen ? '▼' : '►'}
        <input
          className={`modern-input ${inputClass || ''}`}
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder={placeholder}
          style={{ fontWeight: 600, fontSize: '1.1em', border: 'none', background: 'transparent', padding: 0, flex: 1, minWidth: 0 }}
          onClick={e => e.stopPropagation()}
        />
        {onDelete && (
          <span style={{ color: '#c00', fontWeight: 'bold', cursor: 'pointer', marginLeft: 8 }} onClick={e => { e.stopPropagation(); onDelete(); }}>×</span>
        )}
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

function WhoInput({ value, onChange, onCommit, peopleList, datalistId }) {
  return (
    <>
      <input
        type="text"
        list={datalistId}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => onCommit && onCommit()}
        onKeyDown={e => {
          if (e.key === 'Enter' && onCommit) onCommit();
        }}
        className="modern-input action-title-input"
        placeholder="Who..."
      />
      <datalist id={datalistId}>
        {peopleList.map(person => (
          <option key={person} value={person} />
        ))}
      </datalist>
    </>
  );
}

function TemplateSelectModal({ templates, onSelect, onBlank, onCancel }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 32, minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
        <h2 style={{ marginBottom: 24 }}>Choose a Meeting Template</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
          {templates.map(t => (
            <li key={t.id} style={{ marginBottom: 12 }}>
              <button style={{ width: '100%', textAlign: 'left', padding: 12, borderRadius: 6, border: '1px solid #e0e6ed', background: '#f4f7f9', cursor: 'pointer' }} onClick={() => onSelect(t)}>
                {t.name}
              </button>
            </li>
          ))}
        </ul>
        <button className="fancy-button" onClick={onBlank} style={{ marginRight: 12 }}>Start Blank Meeting</button>
        <button className="fancy-button" onClick={onCancel} style={{ background: '#ccc', color: '#333' }}>Cancel</button>
      </div>
    </div>
  );
}

function UnsavedChangesModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: 'white', borderRadius: 10, padding: 36, minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 18, color: '#c00' }}>Unsaved Changes</h2>
        <p style={{ marginBottom: 28, color: '#333', fontSize: '1.1em' }}>You have unsaved changes. Are you sure you want to leave without saving?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button className="fancy-button" style={{ background: '#c00', color: '#fff' }} onClick={onConfirm}>Leave without saving</button>
          <button className="fancy-button" style={{ background: '#eee', color: '#333' }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function SaveSuccessModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: 'white', borderRadius: 10, padding: 36, minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 18, color: '#005a9e' }}>Success</h2>
        <p style={{ marginBottom: 28, color: '#333', fontSize: '1.1em' }}>Meeting minutes have been saved!</p>
        <button className="fancy-button" style={{ background: '#005a9e', color: '#fff', minWidth: 100 }} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

function NewMeetingPage() {
  const { id } = useParams();
  // const [meetingType, setMeetingType] = useState('Tier 2');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [chairedBy, setChairedBy] = useState('');
  const [chairSuggestions, setChairSuggestions] = useState([]);
  
  const [allPeople, setAllPeople] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [currentAttendee, setCurrentAttendee] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [apologies, setApologies] = useState([]);
  const [currentApology, setCurrentApology] = useState('');
  const [apologySuggestions, setApologySuggestions] = useState([]);

  // Agenda structure: [{ title, actions: [actionObj], subheadings: [{ title, actions: [actionObj] }] }]
  const [agenda, setAgenda] = useState([]);
  const [openAgendaIndex, setOpenAgendaIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState({});

  // Add state for ghost lines
  const [ghostAgenda, setGhostAgenda] = useState('');
  const [ghostSub, setGhostSub] = useState({});
  const [ghostAction, setGhostAction] = useState({});
  const [ghostSubAction, setGhostSubAction] = useState({});

  const [isEditing, setIsEditing] = useState(false);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState([]);

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Add state to track which action's images are being viewed
  const [modalImage, setModalImage] = useState(null); // { images: [], agendaIdx, subIdx, actionIdx }

  const [isDirty, setIsDirty] = useState(false);
  const initialStateRef = React.useRef();

  const navigate = useNavigate();

  const [pendingNav, setPendingNav] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [whoInputs, setWhoInputs] = useState({}); // key: `${agendaIdx}-${subIdx}-${actionIdx}`

  // Add local state for chair input
  const [chairInput, setChairInput] = useState(chairedBy);

  useEffect(() => {
    const savedPeople = JSON.parse(localStorage.getItem('peopleList')) || [];
    setAllPeople(savedPeople);
  }, []);

  useEffect(() => {
    if (id) {
      const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
      const found = meetings.find(m => m.id === id);
      if (found) {
        // setMeetingType(found.meetingType || 'Tier 2');
        setMeetingTitle(found.meetingTitle || '');
        setVenue(found.venue || '');
        setChairedBy(found.chairedBy || '');
        setAttendees(found.attendees || []);
        setApologies(found.apologies || []);
        setAgenda(found.agenda || []);
        setDate(found.date || (new Date().toISOString().split('T')[0]));
        setIsEditing(true);
        // Open all agenda sections and subheadings by default
        if (found.agenda && found.agenda.length > 0) {
          setOpenAgendaIndex(found.agenda.map((_, idx) => idx));
          const subOpen = {};
          found.agenda.forEach((item, idx) => {
            if (item.subheadings && item.subheadings.length > 0) {
              subOpen[idx] = item.subheadings.map((_, subIdx) => subIdx);
            }
          });
          setOpenSubIndex(subOpen);
        }
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      // Only show modal for new meetings
      setShowTemplateModal(true);
      const saved = JSON.parse(localStorage.getItem('meetingTemplates')) || [];
      setTemplates(saved);
    }
  }, [id]);

  // Helper to get the current meeting state for comparison
  const getMeetingState = () => JSON.stringify({
    meetingTitle, venue, chairedBy, attendees, apologies, agenda, date
  });

  // Save initial state on mount or when editing an existing meeting
  useEffect(() => {
    initialStateRef.current = getMeetingState();
  }, [isEditing]);

  // Watch for changes to mark as dirty
  useEffect(() => {
    if (initialStateRef.current && getMeetingState() !== initialStateRef.current) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [meetingTitle, venue, chairedBy, attendees, apologies, agenda, date]);

  const handleChairInputChange = (e) => {
    const value = e.target.value;
    setChairedBy(value);
    if (value) {
      if (!allPeople.includes(value)) {
        const updatedAllPeople = [...allPeople, value].sort();
        setAllPeople(updatedAllPeople);
        localStorage.setItem('peopleList', JSON.stringify(updatedAllPeople));
      }
      const filtered = allPeople.filter(p => 
        p.toLowerCase().includes(value.toLowerCase()) && 
        !attendees.includes(p) &&
        !apologies.includes(p)
      );
      setChairSuggestions(filtered);
    } else {
      setChairSuggestions([]);
    }
  };

  const handleSelectChair = (name) => {
    setChairedBy(name);
    setChairSuggestions([]);
    if (!allPeople.includes(name)) {
      const updatedAllPeople = [...allPeople, name].sort();
      setAllPeople(updatedAllPeople);
      localStorage.setItem('peopleList', JSON.stringify(updatedAllPeople));
    }
    if (attendees.includes(name)) { setAttendees(attendees.filter(p => p !== name)); }
    if (apologies.includes(name)) { setApologies(apologies.filter(p => p !== name)); }
  };

  const handleAttendeeInputChange = (e) => {
    const value = e.target.value;
    setCurrentAttendee(value);
    if (value) {
      const filteredSuggestions = allPeople.filter(person => 
        person.toLowerCase().includes(value.toLowerCase()) && 
        !attendees.includes(person) &&
        person !== chairedBy &&
        !apologies.includes(person)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const addAttendee = (name) => {
    if (name && !attendees.includes(name) && name !== chairedBy && !apologies.includes(name)) {
      setAttendees([...attendees, name]);
      if (!allPeople.includes(name)) {
        const updatedAllPeople = [...allPeople, name].sort();
        setAllPeople(updatedAllPeople);
        localStorage.setItem('peopleList', JSON.stringify(updatedAllPeople));
      }
    }
    setCurrentAttendee('');
    setSuggestions([]);
  };

  const handleRemoveAttendee = (attendeeToRemove) => {
    setAttendees(attendees.filter(attendee => attendee !== attendeeToRemove));
  };

  const handleApologyInputChange = (e) => {
    const value = e.target.value;
    setCurrentApology(value);
    if (value) {
      const filtered = allPeople.filter(p => 
        p.toLowerCase().includes(value.toLowerCase()) &&
        !apologies.includes(p) &&
        !attendees.includes(p) &&
        p !== chairedBy
      );
      setApologySuggestions(filtered);
    } else {
      setApologySuggestions([]);
    }
  };

  const addApology = (name) => {
    if (name && !apologies.includes(name) && !attendees.includes(name) && name !== chairedBy) {
      setApologies([...apologies, name]);
      if (!allPeople.includes(name)) {
        const updatedAllPeople = [...allPeople, name].sort();
        setAllPeople(updatedAllPeople);
        localStorage.setItem('peopleList', JSON.stringify(updatedAllPeople));
      }
    }
    setCurrentApology('');
    setApologySuggestions([]);
  };

  const handleRemoveApology = (personToRemove) => {
    setApologies(apologies.filter(p => p !== personToRemove));
  };
  
  // Agenda handlers
  const addAgendaItem = () => {
    setAgenda([...agenda, { title: '', actions: [], subheadings: [] }]);
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

  // Subheading handlers
  const addSubheading = (agendaIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings.push({ title: '', actions: [] });
    setAgenda(newAgenda);
  };
  const updateSubheadingTitle = (agendaIdx, subIdx, value) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings[subIdx].title = value;
    setAgenda(newAgenda);
  };
  const removeSubheading = (agendaIdx, subIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings.splice(subIdx, 1);
    setAgenda(newAgenda);
    setOpenSubIndex((prev) => ({ ...prev, [agendaIdx]: null }));
  };

  // Action handlers (for both agenda and subheadings)
  const emptyAction = { action: '', who: '', when: '', priority: 'Medium', status: 'New', images: [] };
  const addActionToAgenda = (agendaIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].actions.push({ ...emptyAction });
    setAgenda(newAgenda);
  };
  const addActionToSubheading = (agendaIdx, subIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings[subIdx].actions.push({ ...emptyAction });
    setAgenda(newAgenda);
  };
  const updateAgendaAction = (agendaIdx, actionIdx, field, value) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].actions[actionIdx][field] = value;
    setAgenda(newAgenda);
  };
  const updateSubheadingAction = (agendaIdx, subIdx, actionIdx, field, value) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings[subIdx].actions[actionIdx][field] = value;
    setAgenda(newAgenda);
  };
  const removeAgendaAction = (agendaIdx, actionIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].actions.splice(actionIdx, 1);
    setAgenda(newAgenda);
  };
  const removeSubheadingAction = (agendaIdx, subIdx, actionIdx) => {
    const newAgenda = [...agenda];
    newAgenda[agendaIdx].subheadings[subIdx].actions.splice(actionIdx, 1);
    setAgenda(newAgenda);
  };

  // Add agenda item from ghost
  const commitGhostAgenda = () => {
    if (ghostAgenda.trim()) {
      const newAgenda = [...agenda, { title: ghostAgenda, actions: [], subheadings: [] }];
      setAgenda(newAgenda);
      setGhostAgenda('');
      // Auto-open the new agenda section
      const newIdx = newAgenda.length - 1;
      setOpenAgendaIndex(prev => {
        if (Array.isArray(prev)) {
          return prev.includes(newIdx) ? prev : [...prev, newIdx];
        } else if (prev === newIdx) {
          return prev;
        } else if (prev == null) {
          return [newIdx];
        } else {
          return [prev, newIdx];
        }
      });
    }
  };
  // Add subheading from ghost
  const commitGhostSub = (agendaIdx) => {
    if (ghostSub[agendaIdx]?.trim()) {
      const newAgenda = [...agenda];
      newAgenda[agendaIdx].subheadings.push({ title: ghostSub[agendaIdx], actions: [] });
      setAgenda(newAgenda);
      setGhostSub({ ...ghostSub, [agendaIdx]: '' });
      // Auto-open the new subheading section
      const newSubIdx = newAgenda[agendaIdx].subheadings.length - 1;
      setOpenSubIndex(prev => {
        const current = prev[agendaIdx];
        if (Array.isArray(current)) {
          return {
            ...prev,
            [agendaIdx]: current.includes(newSubIdx) ? current : [...current, newSubIdx],
          };
        } else if (current === newSubIdx) {
          return prev;
        } else if (current == null) {
          return { ...prev, [agendaIdx]: [newSubIdx] };
        } else {
          return { ...prev, [agendaIdx]: [current, newSubIdx] };
        }
      });
    }
  };
  // Add action from ghost (agenda)
  const commitGhostAction = (agendaIdx) => {
    if (ghostAction[agendaIdx]?.trim()) {
      const newAgenda = [...agenda];
      newAgenda[agendaIdx].actions.push({ ...emptyAction, action: ghostAction[agendaIdx] });
      setAgenda(newAgenda);
      setGhostAction({ ...ghostAction, [agendaIdx]: '' });
      // Auto-open the agenda section
      setOpenAgendaIndex(prev => {
        if (Array.isArray(prev)) {
          return prev.includes(agendaIdx) ? prev : [...prev, agendaIdx];
        } else if (prev === agendaIdx) {
          return prev;
        } else if (prev == null) {
          return [agendaIdx];
        } else {
          return [prev, agendaIdx];
        }
      });
    }
  };
  // Add action from ghost (subheading)
  const commitGhostSubAction = (agendaIdx, subIdx) => {
    if (ghostSubAction[`${agendaIdx}-${subIdx}`]?.trim()) {
      const newAgenda = [...agenda];
      newAgenda[agendaIdx].subheadings[subIdx].actions.push({ ...emptyAction, action: ghostSubAction[`${agendaIdx}-${subIdx}`] });
      setAgenda(newAgenda);
      setGhostSubAction({ ...ghostSubAction, [`${agendaIdx}-${subIdx}`]: '' });
      // Auto-open the agenda and subheading section
      setOpenAgendaIndex(prev => {
        if (Array.isArray(prev)) {
          return prev.includes(agendaIdx) ? prev : [...prev, agendaIdx];
        } else if (prev === agendaIdx) {
          return prev;
        } else if (prev == null) {
          return [agendaIdx];
        } else {
          return [prev, agendaIdx];
        }
      });
      setOpenSubIndex(prev => {
        const current = prev[agendaIdx];
        if (Array.isArray(current)) {
          return {
            ...prev,
            [agendaIdx]: current.includes(subIdx) ? current : [...current, subIdx],
          };
        } else if (current === subIdx) {
          return prev;
        } else if (current == null) {
          return { ...prev, [agendaIdx]: [subIdx] };
        } else {
          return { ...prev, [agendaIdx]: [current, subIdx] };
        }
      });
    }
  };

  // Add to apologies if a new name is entered in Who
  function handleWhoChange(newValue, agendaIdx, actionIdx, isSub, subIdx) {
    if (newValue && !apologies.includes(newValue) && !attendees.includes(newValue)) {
      setApologies([...apologies, newValue]);
      if (!allPeople.includes(newValue)) {
        const updatedAllPeople = [...allPeople, newValue].sort();
        setAllPeople(updatedAllPeople);
        localStorage.setItem('peopleList', JSON.stringify(updatedAllPeople));
      }
    }
    if (isSub) {
      updateSubheadingAction(agendaIdx, subIdx, actionIdx, 'who', newValue);
    } else {
      updateAgendaAction(agendaIdx, actionIdx, 'who', newValue);
    }
  }

  const handleSave = () => {
    const existingMeetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const newMeeting = {
      id: isEditing ? id : new Date().toISOString(),
      date,
      // meetingType, 
      meetingTitle, venue, chairedBy, attendees, apologies, agenda
    };
    let updatedMeetings;
    if (isEditing) {
      updatedMeetings = existingMeetings.map(m => m.id === id ? newMeeting : m);
    } else {
      updatedMeetings = [...existingMeetings, newMeeting];
    }
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
    setShowSaveSuccess(true);
  };

  function handleTemplateSelect(template) {
    setAgenda(template.agenda ? JSON.parse(JSON.stringify(template.agenda)) : []);
    setShowTemplateModal(false);
  }

  function handleBlankMeeting() {
    setAgenda([]);
    setShowTemplateModal(false);
  }

  const handleSubActionImageChange = (agendaIdx, subIdx, actionIdx, files) => {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);
    const readers = fileArr.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => {
      const prev = agenda[agendaIdx].subheadings[subIdx].actions[actionIdx].images || [];
      updateSubheadingAction(agendaIdx, subIdx, actionIdx, 'images', [...prev, ...imgs]);
    });
  };

  const handleRemoveSubActionImage = (agendaIdx, subIdx, actionIdx, imgIdx) => {
    const prev = agenda[agendaIdx].subheadings[subIdx].actions[actionIdx].images || [];
    const newImgs = prev.filter((_, i) => i !== imgIdx);
    updateSubheadingAction(agendaIdx, subIdx, actionIdx, 'images', newImgs);
  };

  const handleRemoveAllSubActionImages = (agendaIdx, subIdx, actionIdx) => {
    updateSubheadingAction(agendaIdx, subIdx, actionIdx, 'images', []);
  };

  // Add cancel handler for template modal
  const handleCancelTemplateModal = () => {
    navigate('/meeting-minutes');
  };

  const handleSafeNavigate = (to) => {
    if (isDirty) {
      setPendingNav(to);
    } else {
      navigate(to);
    }
  };

  const handleConfirmLeave = () => {
    if (pendingNav) {
      setPendingNav(null);
      navigate(pendingNav);
    }
  };

  const handleCancelLeave = () => {
    setPendingNav(null);
  };

  const handleCloseSaveSuccess = () => {
    setShowSaveSuccess(false);
    navigate('/meeting-minutes/past');
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', background: '#f4f7fa', padding: 0, margin: 0 }}>
      <div className="meeting-form-container">
        {showTemplateModal && (
          <TemplateSelectModal
            templates={templates}
            onSelect={handleTemplateSelect}
            onBlank={handleBlankMeeting}
            onCancel={handleCancelTemplateModal}
          />
        )}
        <div className="form-card">
          <h2 className="card-header"><FaInfoCircle />General Information</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Meeting Title</label>
              <input type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="modern-input" placeholder="e.g., Weekly Sync" />
            </div>
            <div className="form-field">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="modern-input"
              />
            </div>
            <div className="form-field">
              <label>Venue</label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className="modern-input" placeholder="e.g., Conference Room A" />
            </div>
            <div className="form-field">
              <label>Chaired By</label>
              <div className="autocomplete-container">
                <input 
                  type="text" 
                  value={chairInput} 
                  onChange={e => setChairInput(e.target.value)} 
                  onBlur={() => {
                    setChairedBy(chairInput);
                    if (chairInput && !allPeople.includes(chairInput)) {
                      const updatedAllPeople = [...allPeople, chairInput].sort();
                      setAllPeople(updatedAllPeople);
                      localStorage.setItem('peopleList', JSON.stringify(updatedAllPeople));
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setChairedBy(chairInput);
                      if (chairInput && !allPeople.includes(chairInput)) {
                        const updatedAllPeople = [...allPeople, chairInput].sort();
                        setAllPeople(updatedAllPeople);
                        localStorage.setItem('peopleList', JSON.stringify(updatedAllPeople));
                      }
                      e.target.blur(); // Blur the input after committing
                    }
                  }}
                  className="modern-input" 
                  placeholder="e.g., Jane Doe" 
                />
                {chairSuggestions.length > 0 && (
                  <div className="suggestions-list">
                    {chairSuggestions.map(person => (
                      <div key={person} className="suggestion-item" onClick={() => handleSelectChair(person)}>
                        {person}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2 className="card-header"><FaUsers />Attendance</h2>
          <div className="form-field">
            <label>Attendees</label>
            <div className="attendee-tags-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              {attendees.map(name => (
                <span key={name} className="attendee-tag">{name} <button onClick={() => handleRemoveAttendee(name)}>x</button></span>
              ))}
              <input
                type="text"
                value={currentAttendee}
                onChange={handleAttendeeInputChange}
                className="modern-input"
                placeholder="Add attendee..."
                style={{ minWidth: 120, flex: 1, border: 'none', boxShadow: 'none', padding: 0 }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { addAttendee(currentAttendee); }
                }}
              />
              {suggestions.length > 0 && (
                <div className="suggestions-list" style={{ position: 'absolute', marginTop: 40, zIndex: 10 }}>
                  {suggestions.map(person => (
                    <div key={person} className="suggestion-item" onClick={() => addAttendee(person)}>
                      {person}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="form-field" style={{marginTop: '20px'}}>
            <label>Apologies</label>
            <div className="attendee-tags-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              {apologies.map(name => (
                <span key={name} className="attendee-tag">{name} <button onClick={() => handleRemoveApology(name)}>x</button></span>
              ))}
              <input
                type="text"
                value={currentApology}
                onChange={handleApologyInputChange}
                className="modern-input"
                placeholder="Add apology..."
                style={{ minWidth: 120, flex: 1, border: 'none', boxShadow: 'none', padding: 0 }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { addApology(currentApology); }
                }}
              />
              {apologySuggestions.length > 0 && (
                <div className="suggestions-list" style={{ position: 'absolute', marginTop: 40, zIndex: 10 }}>
                  {apologySuggestions.map(person => (
                    <div key={person} className="suggestion-item" onClick={() => addApology(person)}>
                      {person}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2 className="card-header"><FaClipboardList />Agenda</h2>
          {/* Agenda Items */}
          {agenda.map((item, idx) => (
            <CollapsibleEditableTitle
              key={idx}
              title={item.title}
              onTitleChange={value => updateAgendaTitle(idx, value)}
              isOpen={Array.isArray(openAgendaIndex) ? openAgendaIndex.includes(idx) : openAgendaIndex === idx}
              onToggle={() =>
                setOpenAgendaIndex(prev => {
                  if (Array.isArray(prev)) {
                    return prev.includes(idx)
                      ? prev.filter(i => i !== idx)
                      : [...prev, idx];
                  } else if (prev === idx) {
                    return [];
                  } else if (prev == null) {
                    return [idx];
                  } else {
                    return [prev, idx];
                  }
                })
              }
              placeholder={`Agenda Item ${idx + 1}`}
              onDelete={() => removeAgendaItem(idx)}
              inputClass="agenda-title-input"
            >
              {/* Subheadings */}
              {item.subheadings.map((sub, subIdx) => (
                <CollapsibleEditableTitle
                  key={subIdx}
                  title={sub.title}
                  onTitleChange={value => updateSubheadingTitle(idx, subIdx, value)}
                  isOpen={Array.isArray(openSubIndex[idx]) ? openSubIndex[idx].includes(subIdx) : openSubIndex[idx] === subIdx}
                  onToggle={() =>
                    setOpenSubIndex(prev => {
                      const current = prev[idx];
                      if (Array.isArray(current)) {
                        return {
                          ...prev,
                          [idx]: current.includes(subIdx)
                            ? current.filter(i => i !== subIdx)
                            : [...current, subIdx],
                        };
                      } else if (current === subIdx) {
                        return { ...prev, [idx]: [] };
                      } else if (current == null) {
                        return { ...prev, [idx]: [subIdx] };
                      } else {
                        return { ...prev, [idx]: [current, subIdx] };
                      }
                    })
                  }
                  placeholder={`Subheading ${subIdx + 1}`}
                  onDelete={() => removeSubheading(idx, subIdx)}
                  inputClass="subheading-title-input"
                >
                  {/* Actions for subheading */}
                  <div style={{ marginTop: 10 }}>
                    <table className="actions-table">
                      <thead>
                        <tr>
                          <th>Action/Minute</th>
                          <th>Who</th>
                          <th>When</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Images</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sub.actions.map((action, actionIdx) => (
                          <tr key={actionIdx}>
                            <td><textarea value={action.action} onChange={e => updateSubheadingAction(idx, subIdx, actionIdx, 'action', e.target.value)} className="modern-textarea action-title-input" placeholder="Describe the action or minute..." /></td>
                            <td>
                              <WhoInput
                                value={whoInputs[`${idx}-${subIdx}-${actionIdx}`] !== undefined ? whoInputs[`${idx}-${subIdx}-${actionIdx}`] : action.who || ''}
                                onChange={v => setWhoInputs(inputs => ({ ...inputs, [`${idx}-${subIdx}-${actionIdx}`]: v }))}
                                onCommit={() => {
                                  const val = whoInputs[`${idx}-${subIdx}-${actionIdx}`];
                                  if (val && val !== action.who) {
                                    handleWhoChange(val, idx, actionIdx, true, subIdx);
                                  }
                                }}
                                peopleList={[...new Set([...attendees, ...apologies, chairedBy].filter(Boolean))].sort()}
                                datalistId={`who-list-sub-${idx}-${subIdx}`}
                              />
                            </td>
                            <td><input type="date" value={action.when} onChange={e => updateSubheadingAction(idx, subIdx, actionIdx, 'when', e.target.value)} className="modern-input action-title-input" /></td>
                            <td>
                              <select value={action.priority} onChange={e => updateSubheadingAction(idx, subIdx, actionIdx, 'priority', e.target.value)} className="modern-select action-title-input">
                                <option>High</option><option>Medium</option><option>Low</option>
                              </select>
                            </td>
                            <td>
                              <select value={action.status} onChange={e => updateSubheadingAction(idx, subIdx, actionIdx, 'status', e.target.value)} className="modern-select action-title-input">
                                <option>New</option><option>In Progress</option><option>Complete</option><option>Overdue</option>
                              </select>
                            </td>
                            <td>
                              {action.images && action.images.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                  <button type="button" onClick={() => setModalImage({ images: action.images, agendaIdx: idx, subIdx, actionIdx })} style={{ fontSize: 12, color: '#005a9e', background: 'none', border: 'none', cursor: 'pointer', margin: 0, padding: 0 }}>View</button>
                                  <label style={{ fontSize: 12, color: '#005a9e', cursor: 'pointer', margin: 0, padding: 0 }}>
                                    Add
                                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleSubActionImageChange(idx, subIdx, actionIdx, e.target.files)} />
                                  </label>
                                </div>
                              ) : (
                                <label style={{ fontSize: 12, color: '#005a9e', cursor: 'pointer' }}>
                                  Attach
                                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleSubActionImageChange(idx, subIdx, actionIdx, e.target.files)} />
                                </label>
                              )}
                            </td>
                            <td><span style={{ color: '#c00', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => removeSubheadingAction(idx, subIdx, actionIdx)}>×</span></td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={6}>
                            <GhostInput
                              value={ghostSubAction[`${idx}-${subIdx}`] || ''}
                              onChange={v => setGhostSubAction({ ...ghostSubAction, [`${idx}-${subIdx}`]: v })}
                              onCommit={() => commitGhostSubAction(idx, subIdx)}
                              placeholder="+ Add action..."
                              className="ghost-input-action"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CollapsibleEditableTitle>
              ))}
              {/* Ghost line for subheading */}
              <GhostInput
                value={ghostSub[idx] || ''}
                onChange={v => setGhostSub({ ...ghostSub, [idx]: v })}
                onCommit={() => commitGhostSub(idx)}
                placeholder="+ Add subheading..."
                style={{ margin: '10px 0' }}
                className="ghost-input-subheading"
              />
            </CollapsibleEditableTitle>
          ))}
          {/* Ghost line for agenda item */}
          <GhostInput
            value={ghostAgenda}
            onChange={setGhostAgenda}
            onCommit={commitGhostAgenda}
            placeholder="+ Add agenda item..."
            style={{ margin: '10px 0' }}
            className="ghost-input-agenda"
          />
        </div>
        
        <div className="form-actions">
          <button onClick={handleSave} className="fancy-button save-button">Save & Export</button>
        </div>

        <div style={{ marginTop: '40px', borderTop: '1px solid #e0e6ed', paddingTop: '20px' }}>
          <button type="button" className="fancy-button" onClick={() => handleSafeNavigate('/meeting-minutes')}>Back to Meeting Hub</button>
        </div>

        {pendingNav && (
          <UnsavedChangesModal onConfirm={handleConfirmLeave} onCancel={handleCancelLeave} />
        )}

        {modalImage && Array.isArray(modalImage.images) && modalImage.images.length > 0 && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
            <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.25)', position: 'relative', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={() => setModalImage(null)} style={{ position: 'absolute', top: 8, right: 8, fontSize: 24, background: 'none', border: 'none', color: '#c00', cursor: 'pointer' }}>×</button>
              {modalImage.images.map((img, i) => (
                <div key={i} style={{ marginBottom: 24, textAlign: 'center' }}>
                  <img src={img} alt={`Attachment ${i+1}`} style={{ maxWidth: '80vw', maxHeight: '60vh', display: 'block', margin: '0 auto' }} />
                  <button
                    style={{ marginTop: 8, color: '#c00', background: 'none', border: '1px solid #c00', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}
                    onClick={() => {
                      handleRemoveSubActionImage(modalImage.agendaIdx, modalImage.subIdx, modalImage.actionIdx, i);
                      // Update modal images immediately
                      setModalImage(m => ({ ...m, images: m.images.filter((_, idx) => idx !== i) }));
                    }}
                  >Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSaveSuccess && <SaveSuccessModal onClose={handleCloseSaveSuccess} />}
      </div>
    </div>
  );
}

export default NewMeetingPage; 