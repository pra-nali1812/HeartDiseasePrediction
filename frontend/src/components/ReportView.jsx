import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ReportView({ patient, sharedOnly }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (patient) {
      const url = sharedOnly
        ? `predictor/report/${patient.id}/?shared_only=1`
        : `predictor/report/${patient.id}/`;
      api.get(url).then(res => setReports(res.data));
    }
  }, [patient, sharedOnly]);

  if (!patient) return null;

  return (
    <div>
      <h3>Reports for {patient.name}</h3>
      <ul>
        {reports.map(r => (
          <li key={r.id}>
            {r.result ? "High risk" : "Low risk"} ({new Date(r.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
} 