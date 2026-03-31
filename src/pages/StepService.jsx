import { useState, useEffect } from 'react';
import { getServices } from '../api.js';

export default function StepService({ selected, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then(data => setServices(data.services || []))
      .catch(() => setError('無法載入服務項目，請重新整理'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="step-service">
      <h2>服務項目</h2>
      <p className="step-subtitle">選擇一項繼續預約</p>
      <div className="service-list">
        {services.map(service => (
          <button
            key={service.id}
            className={`service-card${selected?.id === service.id ? ' selected' : ''}`}
            onClick={() => onSelect(service)}
          >
            <div className="service-card-inner">
              <div className="service-name">{service.name}</div>
              {service.description && (
                <div className="service-desc">{service.description}</div>
              )}
              <div className="service-tags">
                <span className="service-tag">{service.duration} min</span>
                <span className="service-tag price">NT$ {service.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="service-card-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
