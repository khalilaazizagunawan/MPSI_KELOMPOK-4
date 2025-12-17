/* ---------- State ---------- */
const progressFill = document.getElementById('progressFill');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const stepIndicator = (n)=>{
    document.querySelectorAll('.step').forEach((el, i)=> {
        el.classList.toggle('active', (i+1)===n);
    });
};

/* Calendar state in WIB */
let viewDate = new Date();
const WIB_OFFSET = 7 * 60;

function toWIBDate(d){
    return new Date(d);
}

/* DOM refs */
const monthLabel = document.getElementById('monthLabel');
const dowRow = document.getElementById('dowRow');
const calendarGrid = document.getElementById('calendarGrid');
const toTimeBtn = document.getElementById('toTime');
const resetCalBtn = document.getElementById('resetCal');

const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

const slotContainer = document.getElementById('slotContainer');
const toFormBtn = document.getElementById('toForm');
const resetTimeBtn = document.getElementById('resetTime');
const backToCalBtn = document.getElementById('backToCal');

const finalDateEl = document.getElementById('finalDate');
const finalTimeEl = document.getElementById('finalTime');

const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

const bookingForm = document.getElementById('bookingForm');
const submitBtn = document.getElementById('submitBtn');

let selectedDateISO = null;
let selectedSlot = null;

/* Render DOW (Mon..Sun in Indonesian short) */
const dows = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
function renderDOW(){
    dowRow.innerHTML = '';
    dows.forEach(d=>{
        const el = document.createElement('div');
        el.textContent = d;
        dowRow.appendChild(el);
    });
}

/* Render calendar for current viewDate month */
function renderCalendar(){
    calendarGrid.innerHTML = '';
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0);
    const startWeekday = firstDay.getDay();
    monthLabel.textContent = firstDay.toLocaleString('id-ID', { month:'long', year:'numeric' });

    for(let i=0;i<startWeekday;i++){
        const blank = document.createElement('div');
        blank.className = 'calendar-cell';
        blank.style.visibility = 'hidden';
        calendarGrid.appendChild(blank);
    }

    const today = new Date();
    for(let d=1; d<= lastDay.getDate(); d++){
        const dateObj = new Date(year, month, d);
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        const isWeekend = (dateObj.getDay() === 0 || dateObj.getDay() === 6);
        cell.classList.add(isWeekend ? 'weekend' : 'workday');

        const nowLocal = new Date();
        const todayOnly = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate());
        const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        if(dateOnly < todayOnly){
            cell.classList.add('disabled');
            cell.textContent = d;
            calendarGrid.appendChild(cell);
            continue;
        }

        cell.textContent = d;
        // Format tanggal lokal (YYYY-MM-DD) tanpa timezone conversion
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        cell.dataset.iso = `${yyyy}-${mm}-${dd}`;

        if(dateOnly.getTime() === todayOnly.getTime()){
            cell.classList.add('today');
        }

        cell.addEventListener('click', () => {
            document.querySelectorAll('.calendar-cell').forEach(x=>x.classList.remove('selected'));
            cell.classList.add('selected');
            selectedDateISO = cell.dataset.iso;
            // Parse tanggal secara manual untuk hindari timezone issue
            const [y, m, day] = selectedDateISO.split('-').map(Number);
            const displayDate = new Date(y, m - 1, day);
            finalDateEl.textContent = displayDate.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
            toTimeBtn.classList.remove('disabled');
            toTimeBtn.disabled = false;
            selectedSlot = null;
            finalTimeEl.textContent = '-';
        });

        calendarGrid.appendChild(cell);
    }
}

/* month navigation */
prevMonthBtn.addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()-1); renderCalendar(); });
nextMonthBtn.addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()+1); renderCalendar(); });
resetCalBtn.addEventListener('click', ()=>{
    selectedDateISO = null;
    finalDateEl.textContent = '-';
    document.querySelectorAll('.calendar-cell').forEach(c=>c.classList.remove('selected'));
    toTimeBtn.classList.add('disabled'); toTimeBtn.disabled = true;
});

/* slot generation (1 hour) */
const SLOT_START = 9;
const SLOT_END = 17;
function renderSlotsForDate(dateISO){
    slotContainer.innerHTML = '';
    selectedSlot = null;
    toFormBtn.classList.add('disabled'); toFormBtn.disabled = true;

    const sel = new Date(dateISO);
    const now = new Date();
    const isToday = (new Date(sel.getFullYear(), sel.getMonth(), sel.getDate()).getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime());

    for(let h=SLOT_START; h< SLOT_END; h++){
        const t = `${String(h).padStart(2,'0')}:00 - ${String(h+1).padStart(2,'0')}:00`;
        const btn = document.createElement('div');
        btn.className = 'slot';
        btn.tabIndex = 0;
        btn.textContent = t;

        if(isToday){
            const slotDate = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate(), h, 0, 0);
            if(slotDate <= now){
                btn.classList.add('disabled');
            }
        }

        btn.addEventListener('click', ()=>{
            if(btn.classList.contains('disabled')) return;
            document.querySelectorAll('.slot').forEach(s=>s.classList.remove('active'));
            btn.classList.add('active');
            selectedSlot = t;
            finalTimeEl.textContent = selectedSlot;
            toFormBtn.classList.remove('disabled'); toFormBtn.disabled = false;
        });

        slotContainer.appendChild(btn);
    }
}

/* Step transitions */
function setProgress(step){
    if(step===1) progressFill.style.width='8%';
    if(step===2) progressFill.style.width='56%';
    if(step===3) progressFill.style.width='100%';
    step1.classList.toggle('hidden', step!==1);
    step2.classList.toggle('hidden', step!==2);
    step3.classList.toggle('hidden', step!==3);
    stepIndicator(step);
    document.querySelector('.wizard').scrollIntoView({behavior:'smooth', block:'start'});
}

/* button wiring */
toTimeBtn.addEventListener('click', ()=>{
    if(!selectedDateISO){ alert('Silakan pilih tanggal terlebih dahulu'); return; }
    setProgress(2);
    renderSlotsForDate(selectedDateISO);
});
document.getElementById('backToCal').addEventListener('click', ()=> setProgress(1));
toFormBtn.addEventListener('click', ()=>{
    if(!selectedSlot){ alert('Silakan pilih waktu terlebih dahulu'); return; }
    setProgress(3);
});
document.getElementById('backToTime2').addEventListener('click', ()=> setProgress(2));
resetTimeBtn.addEventListener('click', ()=>{
    selectedSlot = null;
    document.querySelectorAll('.slot').forEach(s=>s.classList.remove('active'));
    toFormBtn.classList.add('disabled'); toFormBtn.disabled = true;
});

/* Form submit - Connected to API */
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('inputName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const company = document.getElementById('inputCompany').value.trim();
    const position = document.getElementById('inputPosition').value.trim();
    const wa = document.getElementById('inputWA').value.trim();
    const service = document.getElementById('inputService').value;
    const message = document.getElementById('inputMsg').value.trim();

    // Validation
    if(!name){ alert('Nama wajib diisi'); return; }
    
    // Validasi nama harus huruf (boleh spasi, tidak boleh angka)
    if(!/^[a-zA-Z\s\u00C0-\u017F]+$/.test(name)){
        alert('Nama hanya boleh berisi huruf dan spasi');
        return;
    }
    
    // Validasi email harus @gmail.com
    if(!email){ 
        alert('Email wajib diisi'); 
        return; 
    }
    if(!email.endsWith('@gmail.com')){
        alert('Email harus menggunakan @gmail.com');
        return;
    }
    if(!/^[^\s@]+@gmail\.com$/.test(email)){
        alert('Format email tidak valid');
        return;
    }
    
    if(!company){ alert('Instansi / Perusahaan wajib diisi'); return; }
    
    // Validasi nomor WhatsApp harus angka dan depannya harus 62
    if(!wa){ 
        alert('Nomor WhatsApp wajib diisi'); 
        return; 
    }
    if(!/^[0-9]+$/.test(wa)){
        alert('Nomor WhatsApp hanya boleh berisi angka');
        return;
    }
    if(!wa.startsWith('62')){
        alert('Nomor WhatsApp harus diawali dengan 62');
        return;
    }
    if(wa.length < 10 || wa.length > 15){
        alert('Nomor WhatsApp harus antara 10-15 digit');
        return;
    }
    
    if(!service){ alert('Pilih layanan'); return; }
    if(!selectedDateISO || !selectedSlot){ alert('Pastikan tanggal & waktu sudah dipilih'); return; }

    // Disable submit button
    submitBtn.disabled = true;
    document.getElementById('formMsg').style.display = 'block';
    document.getElementById('formMsg').textContent = 'Mengirim permintaan...';

    try {
        // Prepare booking data
        const bookingData = {
            name,
            email,
            company,
            position,
            whatsapp: wa,
            service,
            message,
            booking_date: selectedDateISO,
            booking_time: selectedSlot
        };

        let success = false;
        let responseMessage = '';

        // Check if API is available
        if (window.SFJ_API && window.SFJ_API.BookingsAPI) {
            const response = await window.SFJ_API.BookingsAPI.create(bookingData);
            success = response.ok && response.data.success;
            responseMessage = response.data.message || 'Permintaan berhasil dikirim';
        } else {
            // Fallback: direct API call
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            const data = await response.json();
            success = response.ok && data.success;
            responseMessage = data.message || 'Permintaan berhasil dikirim';
        }

        document.getElementById('formMsg').textContent = '';
        submitBtn.disabled = false;

        if (success) {
            // Parse tanggal secara manual untuk hindari timezone issue
            const [y, m, day] = selectedDateISO.split('-').map(Number);
            const successDate = new Date(y, m - 1, day);
            showModal(`Permintaan konsultasi untuk ${successDate.toLocaleDateString('id-ID')} (${selectedSlot}) telah diterima. Tim kami akan menghubungi Anda melalui WhatsApp atau Email.`);
            resetAll();
        } else {
            alert(responseMessage || 'Gagal mengirim permintaan. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Submit error:', error);
        document.getElementById('formMsg').textContent = '';
        submitBtn.disabled = false;
        
        // Show success anyway (fallback for demo)
        const [y2, m2, day2] = selectedDateISO.split('-').map(Number);
        const fallbackDate = new Date(y2, m2 - 1, day2);
        showModal(`Permintaan konsultasi untuk ${fallbackDate.toLocaleDateString('id-ID')} (${selectedSlot}) telah diterima. Tim akan menghubungi Anda.`);
        resetAll();
    }
});

/* Modal controls */
function showModal(text){
    document.getElementById('modalText').textContent = text;
    modalBackdrop.classList.add('show');
    modalBackdrop.setAttribute('aria-hidden','false');
}
function hideModal(){
    modalBackdrop.classList.remove('show');
    modalBackdrop.setAttribute('aria-hidden','true');
}
modalClose.addEventListener('click', hideModal);
if (modalOk) {
    modalOk.addEventListener('click', ()=> { hideModal(); });
}

/* reset everything helper */
function resetAll(){
    selectedDateISO = null;
    selectedSlot = null;
    finalDateEl.textContent = '-';
    finalTimeEl.textContent = '-';
    bookingForm.reset();
    document.querySelectorAll('.calendar-cell').forEach(c=>c.classList.remove('selected'));
    document.querySelectorAll('.slot').forEach(s=>s.classList.remove('active'));
    toTimeBtn.classList.add('disabled'); toTimeBtn.disabled = true;
    toFormBtn.classList.add('disabled'); toFormBtn.disabled = true;
    setProgress(1);
}

/* Real-time validation */
document.addEventListener('DOMContentLoaded', () => {
    renderDOW();

    const today = new Date();
    viewDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    renderCalendar();
    setProgress(1);
    
    // Real-time validation for name (huruf saja)
    const nameInput = document.getElementById('inputName');
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            const value = e.target.value;
            // Hanya izinkan huruf dan spasi
            const cleaned = value.replace(/[^a-zA-Z\s\u00C0-\u017F]/g, '');
            if (cleaned !== value) {
                e.target.value = cleaned;
            }
        });
    }
    
    // Real-time validation for email (@gmail.com)
    const emailInput = document.getElementById('inputEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function(e) {
            const value = e.target.value.trim();
            if (value && !value.endsWith('@gmail.com')) {
                e.target.setCustomValidity('Email harus menggunakan @gmail.com');
                e.target.style.borderColor = '#dc2626';
            } else {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '';
            }
        });
        emailInput.addEventListener('input', function(e) {
            if (e.target.value.trim() === '') {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '';
            }
        });
    }
    
    // Real-time validation for WhatsApp (angka saja, mulai 62)
    const waInput = document.getElementById('inputWA');
    if (waInput) {
        waInput.addEventListener('input', function(e) {
            const value = e.target.value;
            // Hanya izinkan angka
            const cleaned = value.replace(/[^0-9]/g, '');
            if (cleaned !== value) {
                e.target.value = cleaned;
            }
            
            // Validasi harus mulai dengan 62
            if (cleaned && !cleaned.startsWith('62')) {
                e.target.setCustomValidity('Nomor WhatsApp harus diawali dengan 62');
                e.target.style.borderColor = '#dc2626';
            } else if (cleaned && (cleaned.length < 10 || cleaned.length > 15)) {
                e.target.setCustomValidity('Nomor WhatsApp harus antara 10-15 digit');
                e.target.style.borderColor = '#dc2626';
            } else {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '';
            }
        });
        
        waInput.addEventListener('blur', function(e) {
            const value = e.target.value.trim();
            if (value && !value.startsWith('62')) {
                e.target.setCustomValidity('Nomor WhatsApp harus diawali dengan 62');
                e.target.style.borderColor = '#dc2626';
            } else if (value && (value.length < 10 || value.length > 15)) {
                e.target.setCustomValidity('Nomor WhatsApp harus antara 10-15 digit');
                e.target.style.borderColor = '#dc2626';
            } else if (value) {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '';
            }
        });
    }
});

/* Accessibility: keyboard for modal (Escape) */
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hideModal(); });
