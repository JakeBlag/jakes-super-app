import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './MeetingDetailPage.module.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaUsers, FaPrayingHands, FaEdit, FaTrash, FaChevronLeft, FaRegImage } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Badge({ children, type }) {
  const typeClass = type ? styles['badge'] + ' ' + styles[type.toLowerCase().replace(/\s/g, '')] : styles['badge'];
  return <span className={typeClass}>{children}</span>;
}

function DeleteMeetingModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: 'white', borderRadius: 10, padding: 36, minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 18, color: '#c00' }}>Delete Meeting</h2>
        <p style={{ marginBottom: 28, color: '#333', fontSize: '1.1em' }}>Are you sure you want to delete this meeting?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button className={styles.iconBtnRight} style={{ background: '#c00', color: '#fff', borderRadius: 6, padding: '8px 24px', border: 'none', fontWeight: 600 }} onClick={onConfirm}>Delete</button>
          <button className={styles.iconBtnRight} style={{ background: '#eee', color: '#333', borderRadius: 6, padding: '8px 24px', border: 'none', fontWeight: 600 }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const contentRef = React.useRef();

  useEffect(() => {
    const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const found = meetings.find(m => m.id === id);
    setMeeting(found);
  }, [id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const updated = meetings.filter(m => m.id !== id);
    localStorage.setItem('meetings', JSON.stringify(updated));
    setShowDeleteModal(false);
    navigate('/meeting-minutes/past');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleExportPDF = async () => {
    // Hide all elements with class 'no-print' before export
    const noPrintEls = document.querySelectorAll('.no-print');
    const prevDisplay = [];
    noPrintEls.forEach(el => {
      prevDisplay.push(el.style.display);
      el.style.display = 'none';
    });
    const input = contentRef.current;
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    let heightLeft = imgHeight;
    while (heightLeft > pdfHeight) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    pdf.save(`${meeting.meetingTitle || 'meeting-details'}.pdf`);
    // Restore display of no-print elements
    noPrintEls.forEach((el, i) => {
      el.style.display = prevDisplay[i];
    });
  };

  if (!meeting) {
    return <div className={styles.metaCard}><h2>Meeting Not Found</h2></div>;
  }

  return (
    <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '32px 0' }}>
      {/* Title */}
      <div style={{ position: 'relative', margin: '0 0 28px 0', textAlign: 'center' }}>
        <Link to="/meeting-minutes/past" className={styles.iconBtn} data-tooltip="Back to Past Meetings" style={{ color: '#fff', position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', fontSize: '1.7em' }}><FaChevronLeft /></Link>
        <h1 style={{ color: '#fff', fontSize: '2.1em', fontWeight: 800, margin: 0, letterSpacing: 0.5, display: 'inline-block' }}>{meeting.meetingTitle || 'Untitled Meeting'}</h1>
      </div>
      {/* Main Content to Export */}
      <div ref={contentRef}>
        {/* Metadata Card */}
        <div className={styles.metaCard} style={{ color: '#222' }}>
          <div><FaCalendarAlt style={{ marginRight: 6, color: '#005a9e' }} /> <b>Date:</b> {meeting.date || 'Not specified'}</div>
          <div><FaMapMarkerAlt style={{ marginRight: 6, color: '#005a9e' }} /> <b>Venue:</b> {meeting.venue || 'Not specified'}</div>
          <div><FaUser style={{ marginRight: 6, color: '#005a9e' }} /> <b>Chaired By:</b> {meeting.chairedBy || 'Not specified'}</div>
          <div><FaUsers style={{ marginRight: 6, color: '#005a9e' }} /> <b>Attendees:</b> {(meeting.attendees && meeting.attendees.length > 0) ? meeting.attendees.join(', ') : 'None'}</div>
          <div><FaPrayingHands style={{ marginRight: 6, color: '#005a9e' }} /> <b>Apologies:</b> {(meeting.apologies && meeting.apologies.length > 0) ? meeting.apologies.join(', ') : 'None'}</div>
        </div>
        {/* Agenda */}
        <div>
          <h3 style={{ marginBottom: 18, color: '#fff', fontWeight: 600 }}>Agenda</h3>
          {(meeting.agenda && meeting.agenda.length > 0) ? (
            meeting.agenda.map((item, idx) => (
              <div className={`${styles.agendaCard} ${styles.mb4}`} key={idx} style={{ color: '#222' }}>
                <div className={styles.agendaTitle}><span role="img" aria-label="agenda">📝</span> {item.title || 'Untitled'}
                  <span style={{ flex: 1 }} />
                </div>
                {/* Actions for agenda item */}
                {(item.actions && item.actions.length > 0) ? (
                  item.actions.map((action, aIdx) => (
                    <div className={styles.actionRow} key={aIdx} style={{ color: '#222', marginBottom: 8 }}>
                      {action.action && <div style={{ fontSize: '0.98em', color: '#444', marginTop: 2, textAlign: 'left' }}>{action.action}</div>}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: 4,
                          fontSize: '0.8em',
                        }}
                      >
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {action.who && (
                            <span>
                              <span style={{ fontSize: '1em', marginRight: 2 }}>👤</span>
                              <b style={{ marginLeft: 2 }}>{action.who}</b>
                            </span>
                          )}
                        </div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {action.when && (
                            <span>
                              <span style={{ fontSize: '1em', marginRight: 2 }}>📅</span>
                              When: <b style={{ marginLeft: 2 }}>{action.when}</b>
                            </span>
                          )}
                        </div>
                        <div>
                          {action.priority && (
                            <span
                              className={`${styles.badgePill} ${styles[action.priority.toLowerCase()]}`}
                              style={{ color: '#111' }}
                            >
                              {action.priority}
                            </span>
                          )}
                        </div>
                        <div>
                          {action.status && (
                            <span
                              className={`${styles.badgePill} ${styles[action.status.toLowerCase().replace(/\s/g, '')]}`}
                              style={{ color: '#111' }}
                            >
                              {action.status}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Attachments */}
                      {action.images && action.images.length > 0 && (
                        <div className={styles.attachments} style={{ marginTop: 8 }}>
                          {action.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`attachment-${i+1}`}
                              className={styles.thumbnailSm}
                              onClick={() => setModalImage(img)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : null}
                {/* Subheadings */}
                {item.subheadings && item.subheadings.length > 0 && (
                  <div className={styles.subheading}>
                    {item.subheadings.map((sub, sIdx) => (
                      <div key={sIdx} style={{ marginBottom: 10, color: '#222' }}>
                        <div className={styles.agendaTitle} style={{ fontSize: '1.1em', fontWeight: 600, marginBottom: 4 }}><span role="img" aria-label="subheading">📄</span> {sub.title || 'Untitled Subheading'}</div>
                        {(sub.actions && sub.actions.length > 0) ? (
                          sub.actions.map((action, saIdx) => (
                            <div className={styles.actionRow} key={saIdx} style={{ color: '#222', marginBottom: 8 }}>
                              {action.action && <div style={{ fontSize: '0.98em', color: '#444', marginTop: 2, textAlign: 'left' }}>{action.action}</div>}
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: 4,
                                  fontSize: '0.8em',
                                }}
                              >
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {action.who && (
                                    <span>
                                      <span style={{ fontSize: '1em', marginRight: 2 }}>👤</span>
                                      <b style={{ marginLeft: 2 }}>{action.who}</b>
                                    </span>
                                  )}
                                </div>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {action.when && (
                                    <span>
                                      <span style={{ fontSize: '1em', marginRight: 2 }}>📅</span>
                                      When: <b style={{ marginLeft: 2 }}>{action.when}</b>
                                    </span>
                                  )}
                                </div>
                                <div>
                                  {action.priority && (
                                    <span
                                      className={`${styles.badgePill} ${styles[action.priority.toLowerCase()]}`}
                                      style={{ color: '#111' }}
                                    >
                                      {action.priority}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  {action.status && (
                                    <span
                                      className={`${styles.badgePill} ${styles[action.status.toLowerCase().replace(/\s/g, '')]}`}
                                      style={{ color: '#111' }}
                                    >
                                      {action.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Attachments */}
                              {action.images && action.images.length > 0 && (
                                <div className={styles.attachments} style={{ marginTop: 8 }}>
                                  {action.images.map((img, i) => (
                                    <img
                                      key={i}
                                      src={img}
                                      alt={`attachment-${i+1}`}
                                      className={styles.thumbnailSm}
                                      onClick={() => setModalImage(img)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
                {/* Only show 'No actions' if there are truly no actions or subactions */}
                {(!item.actions || item.actions.length === 0) && (!item.subheadings || item.subheadings.every(sub => !sub.actions || sub.actions.length === 0)) && (
                  <div style={{ color: '#888', marginLeft: 8, marginTop: 8 }}>No actions for this agenda item.</div>
                )}
              </div>
            ))
          ) : <p style={{ color: '#888' }}>No agenda items.</p>}
        </div>
        {/* Edit/Delete/Export icon buttons */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button className={`fancy-button no-print`} data-tooltip="Export as PDF" onClick={handleExportPDF}>
            <span role="img" aria-label="export">📄</span> Export as PDF
          </button>
          <button className={styles.iconBtnRight} data-tooltip="Edit meeting" onClick={() => navigate(`/meeting-minutes/edit/${meeting.id}`)} style={{ color: '#fff' }}><span role="img" aria-label="edit">🖉</span></button>
          <button className={styles.iconBtnRight} data-tooltip="Delete meeting" onClick={handleDelete} style={{ color: '#fff' }}><span role="img" aria-label="delete">🗑</span></button>
        </div>
        {showDeleteModal && (
          <DeleteMeetingModal onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
        )}
        {/* Image Modal */}
        {modalImage && (
          <div className={styles.modalBackdrop} onClick={() => setModalImage(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button onClick={() => setModalImage(null)} style={{ position: 'absolute', top: 8, right: 8, fontSize: 24, background: 'none', border: 'none', color: '#c00', cursor: 'pointer' }}>×</button>
              <img src={modalImage} alt="Full attachment" style={{ maxWidth: '80vw', maxHeight: '70vh', display: 'block', margin: '0 auto', borderRadius: 8 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingDetailPage; 