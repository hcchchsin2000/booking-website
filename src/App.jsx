import { useState, useRef } from 'react';
import StepAnnouncement from './pages/StepAnnouncement.jsx';
import StepService from './pages/StepService.jsx';
import StepAddons from './pages/StepAddons.jsx';
import StepDate from './pages/StepDate.jsx';
import StepTime from './pages/StepTime.jsx';
import StepUserInfo from './pages/StepUserInfo.jsx';
import StepConfirm from './pages/StepConfirm.jsx';
import StepComplete from './pages/StepComplete.jsx';

const STEPS = ['服務', '加值', '日期', '時間', '資料', '確認'];

export default function App() {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    service: null,
    addons: [],
    date: '',
    time: '',
    userInfo: { name: '', phone: '', email: '', notes: '', _hp: '' },
  });
  const [bookingResult, setBookingResult] = useState(null);
  const formStartRef = useRef(Date.now());

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);
  const update = (field, value) => setBooking(prev => ({ ...prev, [field]: value }));

  const totalDuration = (booking.service?.duration || 0)
    + (booking.addons.length > 0 ? 30 : 0);

  const showProgress = step >= 1 && step <= 6;

  return (
    <div className="app">
      <header className="app-header">
        <h1>線上預約</h1>
        {showProgress && (
          <div className="progress-bar">
            {STEPS.map((label, i) => {
              const stepNum = i + 1;
              return (
                <div
                  key={i}
                  className={`progress-step${stepNum < step ? ' done' : ''}${stepNum === step ? ' active' : ''}`}
                >
                  <div className="step-dot">{stepNum < step ? '✓' : stepNum}</div>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </header>

      <main className="app-main">
        {step === 0 && (
          <StepAnnouncement onNext={next} />
        )}
        {step === 1 && (
          <StepService
            selected={booking.service}
            onSelect={s => { update('service', s); next(); }}
          />
        )}
        {step === 2 && (
          <StepAddons
            selected={booking.addons}
            serviceName={booking.service?.name || ''}
            serviceDuration={booking.service?.duration || 0}
            onSelect={addons => { update('addons', addons); next(); }}
            onBack={back}
          />
        )}
        {step === 3 && (
          <StepDate
            selected={booking.date}
            onSelect={d => { update('date', d); next(); }}
            onBack={back}
          />
        )}
        {step === 4 && (
          <StepTime
            selected={booking.time}
            date={booking.date}
            duration={totalDuration}
            onSelect={t => { update('time', t); next(); }}
            onBack={back}
          />
        )}
        {step === 5 && (
          <StepUserInfo
            userInfo={booking.userInfo}
            onChange={info => update('userInfo', info)}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 6 && (
          <StepConfirm
            booking={booking}
            totalDuration={totalDuration}
            formStart={formStartRef.current}
            onConfirm={result => { setBookingResult(result); setStep(7); }}
            onBack={back}
          />
        )}
        {step === 7 && (
          <StepComplete bookingResult={bookingResult} booking={booking} />
        )}
      </main>
    </div>
  );
}
