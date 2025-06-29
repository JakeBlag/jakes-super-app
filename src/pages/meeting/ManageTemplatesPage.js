import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MeetingForm.css';
import { FaRegClone, FaTrash, FaEdit, FaSave, FaPlus, FaChevronDown, FaChevronRight } from 'react-icons/fa';

function defaultTemplates() {
  return [
    {
      id: 'default-tier2',
      name: 'Tier 2 Engineering',
      agenda: [
        { title: 'Safety', actions: [], subheadings: [] },
        { title: 'Actions from Previous Meeting', actions: [], subheadings: [] },
        { title: 'General Business', actions: [], subheadings: [] },
        { title: 'AOB', actions: [], subheadings: [] },
      ],
    },
    {
      id: 'default-project',
      name: 'Project Meeting',
      agenda: [
        { title: 'Project Updates', actions: [], subheadings: [] },
        { title: 'Risks & Issues', actions: [], subheadings: [] },
        { title: 'Next Steps', actions: [], subheadings: [] },
      ],
    },
  ];
}

function AgendaEditor({ agenda, setAgenda }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [ghostAgenda, setGhostAgenda] = useState('');
  const [ghostSub, setGhostSub] = useState({});

  const addAgendaItem = () => {
    if (ghostAgenda.trim()) {
      setAgenda([...agenda, { title: ghostAgenda, subheadings: [], actions: [] }]);
      setGhostAgenda('');
    }
  };
  const updateAgendaTitle = (idx, value) => {
    const newAgenda = [...agenda];
    newAgenda[idx].title = value;
    setAgenda(newAgenda);
  };
  const removeAgendaItem = (idx) => {
    setAgenda(agenda.filter((_, i) => i !== idx));
    setOpenIdx(null);
  };
  const addSubheading = (agendaIdx) => {
    if (ghostSub[agendaIdx]?.trim()) {
      const newAgenda = [...agenda];
      newAgenda[agendaIdx].subheadings = newAgenda[agendaIdx].subheadings || [];
      newAgenda[agendaIdx].subheadings.push({ title: ghostSub[agendaIdx], actions: [] });
      setAgenda(newAgenda);
      setGhostSub({ ...ghostSub, [agendaIdx]: '' });
    }
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
  };

  return (
    <div style={{ margin: '10px 0 20px 0', padding: '10px', background: '#f8fafc', borderRadius: 8 }}>
      <b>Agenda Structure</b>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {agenda.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span onClick={() => setOpenIdx(openIdx === idx ? null : idx)} style={{ cursor: 'pointer' }}>
                {openIdx === idx ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <input
                className="modern-input agenda-title-input"
                type="text"
                value={item.title}
                onChange={e => updateAgendaTitle(idx, e.target.value)}
                placeholder={`Agenda Item ${idx + 1}`}
                style={{ flex: 1 }}
              />
              <span style={{ color: '#c00', fontWeight: 'bold', cursor: 'pointer', marginLeft: 8 }} onClick={() => removeAgendaItem(idx)}>×</span>
            </div>
            {openIdx === idx && (
              <ul style={{ listStyle: 'none', paddingLeft: 32, marginTop: 8 }}>
                {(item.subheadings || []).map((sub, subIdx) => (
                  <li key={subIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <input
                      className="modern-input subheading-title-input"
                      type="text"
                      value={sub.title}
                      onChange={e => updateSubheadingTitle(idx, subIdx, e.target.value)}
                      placeholder={`Subheading ${subIdx + 1}`}
                      style={{ flex: 1 }}
                    />
                    <span style={{ color: '#c00', fontWeight: 'bold', cursor: 'pointer', marginLeft: 8 }} onClick={() => removeSubheading(idx, subIdx)}>×</span>
                  </li>
                ))}
                <li>
                  <input
                    className="modern-input ghost-input-subheading"
                    type="text"
                    value={ghostSub[idx] || ''}
                    onChange={e => setGhostSub({ ...ghostSub, [idx]: e.target.value })}
                    placeholder="+ Add subheading..."
                    style={{ margin: '4px 0', opacity: 0.5 }}
                    onKeyDown={e => { if (e.key === 'Enter') addSubheading(idx); }}
                  />
                </li>
              </ul>
            )}
          </li>
        ))}
        <li>
          <input
            className="modern-input ghost-input-agenda"
            type="text"
            value={ghostAgenda}
            onChange={e => setGhostAgenda(e.target.value)}
            placeholder="+ Add agenda item..."
            style={{ margin: '4px 0', opacity: 0.5 }}
            onKeyDown={e => { if (e.key === 'Enter') addAgendaItem(); }}
          />
        </li>
      </ul>
    </div>
  );
}

function ensureActionsStructure(agenda) {
  return (agenda || []).map(item => ({
    ...item,
    actions: Array.isArray(item.actions) ? item.actions : [],
    subheadings: (item.subheadings || []).map(sub => ({
      ...sub,
      actions: Array.isArray(sub.actions) ? sub.actions : [],
    })),
  }));
}

function ManageTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editingAgenda, setEditingAgenda] = useState([]);

  // Load templates from localStorage or use defaults
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('meetingTemplates'));
    if (saved && saved.length) {
      setTemplates(saved);
    } else {
      setTemplates(defaultTemplates());
      localStorage.setItem('meetingTemplates', JSON.stringify(defaultTemplates()));
    }
  }, []);

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (newName && !templates.some(t => t.name === newName)) {
      const newTemplate = {
        id: Date.now().toString(),
        name: newName,
        agenda: [],
      };
      const updated = [...templates, newTemplate];
      setTemplates(updated);
      localStorage.setItem('meetingTemplates', JSON.stringify(updated));
      setNewName('');
    }
  };

  const handleRemoveTemplate = (id) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('meetingTemplates', JSON.stringify(updated));
  };

  const handleEditClick = (id, name, agenda) => {
    setEditingId(id);
    setEditedName(name);
    setEditingAgenda(JSON.parse(JSON.stringify(agenda || [])));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName('');
    setEditingAgenda([]);
  };

  const handleSaveEdit = () => {
    if (editedName && !templates.some(t => t.name === editedName && t.id !== editingId)) {
      const updated = templates.map(t => t.id === editingId ? { ...t, name: editedName, agenda: ensureActionsStructure(editingAgenda) } : t);
      setTemplates(updated);
      localStorage.setItem('meetingTemplates', JSON.stringify(updated));
    }
    setEditingId(null);
    setEditedName('');
    setEditingAgenda([]);
  };

  return (
    <div className="meeting-form-container">
      <div className="form-card">
        <h2 className="card-header"><FaRegClone />Manage Meeting Templates</h2>
        <form onSubmit={handleAddTemplate} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="modern-input"
            placeholder="Enter new template name"
          />
          <button type="submit" className="fancy-button"><FaPlus /> Add Template</button>
        </form>
        <div>
          <h3>Current Templates ({templates.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {templates.map(template => (
              <li key={template.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e0e6ed', gap: '10px', padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editingId === template.id ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="modern-input"
                        autoFocus
                        style={{ flexGrow: 1 }}
                      />
                      <button onClick={handleSaveEdit} className="fancy-button save-button"><FaSave /></button>
                      <button onClick={handleCancelEdit} className="fancy-button" style={{backgroundColor: '#777'}}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span style={{flexGrow: 1}}>{template.name}</span>
                      <div style={{display: 'flex', gap: '10px'}}>
                        <button onClick={() => handleEditClick(template.id, template.name, template.agenda)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#005a9e', fontSize: '1.2em' }}><FaEdit /></button>
                        <button onClick={() => handleRemoveTemplate(template.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: '1.2em' }}><FaTrash /></button>
                      </div>
                    </>
                  )}
                </div>
                {editingId === template.id && (
                  <>
                    <AgendaEditor agenda={editingAgenda} setAgenda={setEditingAgenda} />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link to="/meeting-minutes" className="fancy-button">Back to Meeting Hub</Link>
      </div>
    </div>
  );
}

export default ManageTemplatesPage; 