import { useState, useEffect } from 'react';
import { getAvailableSlots } from '../api.js';

export default function StepTime({ selected, date, duration, onSelect, onBack }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAvailableSlots(date, duration)
      .then(data => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [date, duration]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  const morning = slots.filter(s => parseInt(s) < 12);
  const afternoon = slots.filter(s => { const h = parseInt(s); return h >= 12 && h < 18; });
  const evening = slots.filter(s => parseInt(s) >= 18);

  const TimeGroup = ({ label, items }) =>
    items.length > 0 ? (
      <div className="time-group">
        <div className="time-group-label">{label}</div>
        <div className="time-grid">
          {items.map(slot => (
            <button
              key={slot}
              className={`time-slot${selected === slot ? ' selected' : ''}`}
              onClick={() => onSelect(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div className="step-time">
      <h2>選擇時間</h2>
      <p className="date-hint">{date}</p>
      {slots.length === 0 ? (
        <div className="no-slots">
          <p>此日期已無可預約時段</p>
          <button className="btn-back" onClick={onBack}>← 選擇其他日期</button>
        </div>
      ) : (
        <>
          <TimeGroup label="上午" items={morning} />
          <TimeGroup label="下午" items={afternoon} />
          <TimeGroup label="晚上" items={evening} />
          <button className="btn-back" onClick={onBack}>← 返回</button>
        </>
      )}
    </div>
  );
}
