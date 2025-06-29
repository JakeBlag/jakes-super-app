import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MeetingForm.css'; // Re-use the same modern styles
import { FaUserPlus, FaTrash, FaEdit, FaSave } from 'react-icons/fa';

function ManagePeoplePage() {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState('');

  // State for the inline editing feature
  const [editingPerson, setEditingPerson] = useState(null); // Holds the original name of the person being edited
  const [editedName, setEditedName] = useState('');     // Holds the new value from the input field

  // Load people from localStorage on initial render
  useEffect(() => {
    const savedPeople = JSON.parse(localStorage.getItem('peopleList')) || [];
    setPeople(savedPeople);
  }, []);

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (newName && !people.includes(newName)) {
      const updatedPeople = [...people, newName].sort();
      setPeople(updatedPeople);
      localStorage.setItem('peopleList', JSON.stringify(updatedPeople));
      setNewName(''); // Clear input field
    }
  };

  const handleRemovePerson = (personToRemove) => {
    const updatedPeople = people.filter(p => p !== personToRemove);
    setPeople(updatedPeople);
    localStorage.setItem('peopleList', JSON.stringify(updatedPeople));
  };
  
  const handleEditClick = (person) => {
    setEditingPerson(person);
    setEditedName(person);
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setEditedName('');
  };

  const handleSaveEdit = () => {
    // Prevent saving an empty name or a name that already exists
    if (editedName && !people.includes(editedName)) {
      const updatedPeople = people.map(p => (p === editingPerson ? editedName : p)).sort();
      setPeople(updatedPeople);
      localStorage.setItem('peopleList', JSON.stringify(updatedPeople));
    }
    setEditingPerson(null);
    setEditedName('');
  };

  return (
    <div className="meeting-form-container">
      <div className="form-card">
        <h2 className="card-header"><FaUserPlus />Manage People</h2>
        <form onSubmit={handleAddPerson} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="modern-input"
            placeholder="Enter new person's name"
          />
          <button type="submit" className="fancy-button">Add Person</button>
        </form>

        <div>
          <h3>Current People List ({people.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {people.map(person => (
              <li key={person} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #e0e6ed', gap: '10px' }}>
                {editingPerson === person ? (
                  <>
                    <input 
                      type="text" 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)}
                      className="modern-input"
                      autoFocus
                    />
                    <button onClick={handleSaveEdit} className="fancy-button save-button"><FaSave /></button>
                    <button onClick={handleCancelEdit} className="fancy-button" style={{backgroundColor: '#777'}}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span style={{flexGrow: 1}}>{person}</span>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <button onClick={() => handleEditClick(person)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#005a9e', fontSize: '1.2em' }}>
                            <FaEdit />
                        </button>
                        <button onClick={() => handleRemovePerson(person)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: '1.2em' }}>
                            <FaTrash />
                        </button>
                    </div>
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

export default ManagePeoplePage; 