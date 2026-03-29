import { useState, useEffect } from 'react';
import { getClosedDates } from '../api.js';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function StepDate({ selected, onSelect, onBack }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [closedDates, setClosedDates] = useState([]);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);

  useEffect(() => {
    getClosedDates()
      .then(data => setClosedDates(data.dates || []))
      .catch(() => {});
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const dateStr = formatDate(date);
    const isPast = date < today;
    const isTooFar = date > maxDate;
    const isClosed = closedDates.includes(dateStr);
    cells.push({ day: d, dateStr, disabled: isPast || isTooFar || isClosed });
  }

  const canPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const monthLabel = `${viewYear} 年 ${viewMonth + 1} 月`;

  return (
    <div className="step-date">
      <h2>選擇日期</h2>
      <div className="calendar">
        <div className="calendar-nav">
          <button onClick={prevMonth} disabled={!canPrev}>‹</button>
          <span>{monthLabel}</span>
          <button onClick={nextMonth}>›</button>
        </div>
        <div className="calendar-grid">
          {WEEKDAYS.map(w => (
            <div key={w} className="weekday-label">{w}</div>
          ))}
          {cells.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} />;
            return (
              <button
                key={cell.dateStr}
                className={`calendar-day${cell.disabled ? ' disabled' : ''}${selected === cell.dateStr ? ' selected' : ''}`}
                onClick={() => !cell.disabled && onSelect(cell.dateStr)}
                disabled={cell.disabled}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>
      <button className="btn-back" onClick={onBack}>← 返回</button>
    </div>
  );
}
