import { useState, useEffect } from 'react';
import { getAnnouncement } from '../api.js';

export default function StepAnnouncement({ onNext }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncement()
      .then(d => setData(d))
      .catch(() => setData({ text: '' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  if (!data?.text) {
    onNext();
    return null;
  }

  const textStyle = {};
  if (data.fontSize) textStyle.fontSize = data.fontSize + 'px';
  if (data.fontFamily) textStyle.fontFamily = data.fontFamily;

  return (
    <div className="step-announcement">
      <h2>公告</h2>
      <div className="announcement announcement-fixed">
        <div className="announcement-text" style={textStyle}>{data.text}</div>
      </div>
      <button className="btn-primary" onClick={onNext}>
        開始預約
      </button>
    </div>
  );
}
