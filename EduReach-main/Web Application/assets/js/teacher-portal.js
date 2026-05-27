// assets/js/teacher-portal.js

// Utility functions
function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

function calculateAverage(marks) {
  const values = Object.values(marks);
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

function createStudentItem(student) {
  const li = document.createElement('li');
  li.className = 'student-item';
  // Show name, watch time, attendance in the list entry
  const watch = formatTime(student.watchTime);
  li.innerHTML = `
    <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a; margin-bottom: 8px;">${student.name}</div>
    <div style="display: flex; flex-direction: column; gap: 4px; color: #64748b; font-size: 0.9rem;">
      <span>⏱ Watch: ${watch}</span>
      <span>📅 Attend: ${student.attendance}%</span>
    </div>
  `;
  li.addEventListener('click', () => showStudentDetail(student));
  return li;
}

function loadStudents(classId) {
  fetch('assets/data/classes.json')
    .then(res => res.json())
    .then(data => {
      const students = data[classId] || [];
      // Target the specific container for this class
      const listContainer = document.getElementById('student-list-' + classId);
      if (!listContainer) {
        console.error('Container not found for class:', classId);
        return;
      }
      listContainer.innerHTML = '';
      const ul = document.createElement('ul');
      ul.className = 'student-ul';
      // Show students
      students.forEach(student => {
        ul.appendChild(createStudentItem(student));
      });
      listContainer.appendChild(ul);
    })
    .catch(err => console.error('Failed to load student data:', err));
}

function showStudentDetail(student) {
  const modal = document.getElementById('student-detail-modal');
  const body = document.getElementById('modal-body');
  const avg = calculateAverage(student.marks);
  const watchFormatted = formatTime(student.watchTime);

  const marksRows = Object.entries(student.marks)
    .map(([sub, val]) => `<tr><td>${sub}</td><td><span class="score-pill">${val}%</span></td></tr>`)
    .join('');

  body.innerHTML = `
    <h2 class="modal-student-name">${student.name}</h2>
    <div class="modal-stats-grid">
      <div class="stat-card">
        <span class="stat-label">Watch Time</span>
        <span class="stat-value">${watchFormatted}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Attendance</span>
        <span class="stat-value">${student.attendance}%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Overall</span>
        <span class="stat-value">${avg}%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Grade</span>
        <span class="stat-value grade-badge-${student.grade.charAt(0)}">${student.grade}</span>
      </div>
    </div>

    <div class="watch-progress-section">
      <label>Course Engagement</label>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width:${Math.min((student.watchTime / 200) * 100, 100)}%"></div>
      </div>
    </div>

    <h3 class="section-subtitle">Subject-wise Marks</h3>
    <table class="modal-marks-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>${marksRows}</tbody>
    </table>
  `;
  modal.classList.remove('hidden');
}

function closeStudentModal() {
  const modal = document.getElementById('student-detail-modal');
  modal.classList.add('hidden');
}

// Attendance Marking Functions
function loadAttendanceForm(classId) {
  fetch('assets/data/classes.json')
    .then(res => res.json())
    .then(data => {
      const students = data[classId] || [];
      const tbody = document.getElementById('attendance-list-body');
      document.getElementById('attendance-title').innerText = `Class ${classId} Students`;
      
      tbody.innerHTML = '';
      students.forEach((student, index) => {
        const rollNo = (parseInt(classId) * 100) + (index + 1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${rollNo}</td>
          <td style="font-weight: 600;">${student.name}</td>
          <td style="text-align: center;">
            <div style="display: flex; justify-content: center; gap: 10px;">
              <label style="cursor: pointer; padding: 5px 12px; border-radius: 4px; background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.8rem;">
                <input type="radio" name="att-${student.id}" value="present" checked style="margin-right: 5px;"> P
              </label>
              <label style="cursor: pointer; padding: 5px 12px; border-radius: 4px; background: #fee2e2; color: #dc2626; font-weight: 700; font-size: 0.8rem;">
                <input type="radio" name="att-${student.id}" value="absent" style="margin-right: 5px;"> A
              </label>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function markAllPresent() {
  const radios = document.querySelectorAll('input[type="radio"][value="present"]');
  radios.forEach(r => r.checked = true);
}

function saveAttendance() {
  const date = document.getElementById('attendance-date').value;
  const classId = document.getElementById('attendance-class-select').value;
  
  // Simulation of success
  const btn = document.querySelector('#attendance-form button[type="submit"]');
  const originalText = btn.innerText;
  
  btn.innerText = '✅ Saved Locally';
  btn.style.background = '#16a34a';
  
  setTimeout(() => {
    alert(`Attendance for Class ${classId} on ${date} has been saved and queued for sync!`);
    btn.innerText = originalText;
    btn.style.background = '#F15A22';
    switchTab('attendance', document.querySelectorAll('.sidebar-link')[4]); // Switch to history
  }, 1000);
}

// Expose functions globally
window.loadStudents = loadStudents;
window.closeStudentModal = closeStudentModal;
window.loadAttendanceForm = loadAttendanceForm;
window.markAllPresent = markAllPresent;
window.saveAttendance = saveAttendance;
