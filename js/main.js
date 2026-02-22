
  // ─── MENU ───
  function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
  }

  // ─── QUOTE CALCULATOR ───
  const serviceData = {
    wiring_room: { min: 2500, max: 5000, note: "Per room. Includes wiring, switches & sockets. Panel extra." },
    wiring_full: { min: 35000, max: 65000, note: "3BHK full wiring with MCB panel. Parts & labour included." },
    inverter_install: { min: 800, max: 2000, note: "Installation charge. Inverter/battery unit priced separately." },
    inverter_repair: { min: 500, max: 3500, note: "Diagnosis + repair. Replacement parts billed extra if needed." },
    cctv_4: { min: 8000, max: 14000, note: "4-camera system with DVR, cables & installation. HD cameras." },
    cctv_8: { min: 14000, max: 24000, note: "8-camera NVR system, 2TB storage, cabling & installation." },
    smart_home: { min: 12000, max: 28000, note: "Basic smart home: smart switches, automation hub & app setup." },
    geyser_repair: { min: 400, max: 1200, note: "Diagnostic + standard repair. Element/part replacement extra." },
    fan_install: { min: 200, max: 500, note: "Per fan installation including wiring connection." },
    safety_audit: { min: 2000, max: 5000, note: "Full safety audit with written report and recommendations." },
    earthing: { min: 3500, max: 8000, note: "Pipe/plate earthing system with testing and certificate." },
    emergency: { min: 500, max: 1500, note: "Base call-out charge. Service/repair fees are additional." },
  };

  function calculateQuote() {
    const service = document.getElementById('calcService').value;
    const area = parseFloat(document.getElementById('calcArea').value) || 1;
    const urgency = parseFloat(document.getElementById('calcUrgency').value) || 1;
    const resultEl = document.getElementById('quoteResult');
    const priceEl = document.getElementById('resultPrice');
    const noteEl = document.getElementById('resultNote');
    if (!service || !serviceData[service]) { resultEl.classList.remove('show'); return; }
    const d = serviceData[service];
    const min = Math.round(d.min * area * urgency / 100) * 100;
    const max = Math.round(d.max * area * urgency / 100) * 100;
    priceEl.textContent = `₹ ${min.toLocaleString('en-IN')} – ₹ ${max.toLocaleString('en-IN')}`;
    noteEl.textContent = d.note;
    resultEl.classList.add('show');
    // Update range slider visual
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(r => { const pct = ((r.value-r.min)/(r.max-r.min))*100; r.style.background=`linear-gradient(90deg, var(--blue-light) ${pct}%, var(--border) ${pct}%)`; });
  }

  function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    const sv = document.getElementById('calcService').value;
    if (sv) {
      const map = { wiring_room:'Home Wiring / Rewiring', wiring_full:'Home Wiring / Rewiring', inverter_install:'Inverter / Stabilizer Repair', inverter_repair:'Inverter / Stabilizer Repair', cctv_4:'CCTV Installation', cctv_8:'CCTV Installation', smart_home:'Smart Home Automation', geyser_repair:'Geyser / Appliance Repair', fan_install:'Fan / Light Installation', safety_audit:'Electrical Safety Audit', earthing:'Earthing System', emergency:'Other / Not Sure' };
      const sel = document.getElementById('bookService');
      for (let o of sel.options) { if (o.text === map[sv]) { sel.value = o.value; break; } }
    }
  }

  // ─── CALENDAR ───
  let currentDate = new Date();
  let selectedDay = null;
  let selectedSlot = null;

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calMonthLabel').textContent = `${months[month]} ${year}`;
    const grid = document.getElementById('calGrid');
    grid.innerHTML = '';
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-day-name'; el.textContent = d; grid.appendChild(el);
    });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // booked days for demo
    const bookedDays = [5, 12, 19, 22];
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div'); el.className = 'cal-day empty'; grid.appendChild(el);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      const thisDate = new Date(year, month, d);
      const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isBooked = bookedDays.includes(d);
      el.className = 'cal-day' + (isPast ? ' past' : '') + (isToday ? ' today' : '') + (isBooked && !isPast ? ' booked' : '');
      el.textContent = d;
      if (!isPast && !isBooked) { el.onclick = () => selectDay(d, el); }
      if (d === selectedDay) el.classList.add('selected');
      grid.appendChild(el);
    }
  }

  function selectDay(d, el) {
    document.querySelectorAll('.cal-day.selected').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    selectedDay = d;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const m = currentDate.getMonth(); const y = currentDate.getFullYear();
    document.getElementById('summDate').textContent = `${d} ${months[m]} ${y}`;
  }

  function changeMonth(dir) { currentDate.setMonth(currentDate.getMonth() + dir); selectedDay = null; renderCalendar(); document.getElementById('summDate').textContent = 'Not selected'; }

  function selectSlot(el) {
    document.querySelectorAll('.slot.selected').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    selectedSlot = el.textContent;
    document.getElementById('summTime').textContent = selectedSlot;
  }

  function confirmBooking() {
    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const address = document.getElementById('bookAddress').value.trim();
    const service = document.getElementById('bookService').value;
    if (!name || !phone) { alert('Please enter your name and mobile number.'); return; }
    if (!selectedDay) { alert('Please select a date on the calendar.'); return; }
    if (!selectedSlot) { alert('Please select a time slot.'); return; }
    const id = 'JES-' + Date.now().toString().slice(-6);
    document.getElementById('bookingId').textContent = id;
    document.getElementById('bookingConfirm').classList.add('show');
    document.getElementById('bookingConfirm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ─── TRACKER ───
  const demoData = {
    'JES-001': {
      status: 'in-progress', label: 'In Progress',
      steps: [
        { title: 'Booking Confirmed', meta: 'Today, 10:30 AM', state: 'done' },
        { title: 'Technician Assigned', meta: 'Ravi Kumar (ID: TECH-07)', state: 'done' },
        { title: 'Technician En Route', meta: 'ETA ~25 minutes — Gandhi Nagar', state: 'active' },
        { title: 'Work in Progress', meta: 'Pending', state: 'pending' },
        { title: 'Job Completed & Invoiced', meta: 'Pending', state: 'pending' },
      ],
      tech: { name: 'Ravi Kumar', id: 'TECH-07', initials: 'RK' }
    },
    'JES-002': {
      status: 'completed', label: 'Completed ✓',
      steps: [
        { title: 'Booking Confirmed', meta: 'Yesterday, 9:00 AM', state: 'done' },
        { title: 'Technician Assigned', meta: 'Suresh Gupta (ID: TECH-03)', state: 'done' },
        { title: 'Technician Arrived', meta: 'Yesterday, 10:15 AM', state: 'done' },
        { title: 'Work Completed', meta: 'Yesterday, 12:30 PM', state: 'done' },
        { title: 'Invoice Sent via WhatsApp', meta: 'Yesterday, 12:45 PM', state: 'done' },
      ],
      tech: { name: 'Suresh Gupta', id: 'TECH-03', initials: 'SG' }
    },
    'JES-003': {
      status: 'pending', label: 'Scheduled',
      steps: [
        { title: 'Booking Confirmed', meta: 'Just now', state: 'done' },
        { title: 'Technician to be Assigned', meta: 'Within 2 hours of booking', state: 'active' },
        { title: 'Technician En Route', meta: 'Pending', state: 'pending' },
        { title: 'Work in Progress', meta: 'Pending', state: 'pending' },
        { title: 'Job Completed & Invoiced', meta: 'Pending', state: 'pending' },
      ],
      tech: null
    }
  };

  function demoTrack(id) { document.getElementById('trackerId').value = id; document.getElementById('trackerPhone').value = '+91 98765 43210'; trackRequest(); }

  function trackRequest() {
    const id = document.getElementById('trackerId').value.trim().toUpperCase();
    const result = document.getElementById('trackerResult');
    if (!demoData[id]) {
      result.classList.remove('show');
      alert('Booking ID not found. Try demo IDs: JES-001, JES-002, or JES-003');
      return;
    }
    const d = demoData[id];
    document.getElementById('trackDisplayId').textContent = id;
    const badge = document.getElementById('trackBadge');
    badge.textContent = d.label;
    badge.className = 'status-badge ' + d.status;
    const steps = document.getElementById('trackSteps');
    steps.innerHTML = d.steps.map((s, i) => `
      <div class="status-step">
        <div class="step-left">
          <div class="step-dot ${s.state}">${s.state==='done'?'✓':s.state==='active'?'▶':(i+1)}</div>
          ${i < d.steps.length-1 ? `<div class="step-line ${s.state==='done'?'done':''}"></div>` : ''}
        </div>
        <div class="step-content">
          <div class="step-title">${s.title}</div>
          <div class="step-meta">${s.meta}</div>
        </div>
      </div>`).join('');
    const techEl = document.getElementById('techInfo');
    if (d.tech) {
      techEl.innerHTML = `<div class="tech-avatar">${d.tech.initials}</div><div><div class="tech-name">🔧 ${d.tech.name}</div><div class="tech-id">Assigned Technician · ${d.tech.id} · Verified ✓</div></div>`;
      techEl.style.display = 'flex';
    } else { techEl.style.display = 'none'; }
    result.classList.add('show');
  }

  // ─── SCROLL ANIMATIONS ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ─── INIT ───
  renderCalendar();
function closeBubble() {
    const b = document.getElementById('waBubble');
    if (b) b.classList.add('wa-hidden');
  }
  // Auto-hide bubble after 9 seconds
  setTimeout(closeBubble, 9000);

  function filterRates(cat, btn) {
    // Update active tab
    document.querySelectorAll('.rate-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    // Show/hide blocks
    document.querySelectorAll('.rate-table-block').forEach(block => {
      if (cat === 'all' || block.dataset.cat === cat) {
        block.classList.remove('hidden');
      } else {
        block.classList.add('hidden');
      }
    });
  }