import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalculatorApp from './pages/CalculatorApp';
import TodoListApp from './pages/TodoListApp';
import MeetingHomePage from './pages/meeting/MeetingHomePage';
import NewMeetingPage from './pages/meeting/NewMeetingPage';
import PastMeetingsPage from './pages/meeting/PastMeetingsPage';
import ManagePeoplePage from './pages/meeting/ManagePeoplePage';
import MeetingDetailPage from './pages/meeting/MeetingDetailPage';
import ManageTemplatesPage from './pages/meeting/ManageTemplatesPage';
import SettingsPage from './pages/meeting/SettingsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<CalculatorApp />} />
            <Route path="/todolist" element={<TodoListApp />} />
            <Route path="/meeting-minutes" element={<MeetingHomePage />} />
            <Route path="/meeting-minutes/new" element={<NewMeetingPage />} />
            <Route path="/meeting-minutes/past" element={<PastMeetingsPage />} />
            <Route path="/meeting-minutes/past/:id" element={<MeetingDetailPage />} />
            <Route path="/meeting-minutes/edit/:id" element={<NewMeetingPage />} />
            <Route path="/meeting-minutes/people" element={<ManagePeoplePage />} />
            <Route path="/meeting-minutes/templates" element={<ManageTemplatesPage />} />
            <Route path="/meeting-minutes/settings" element={<SettingsPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
