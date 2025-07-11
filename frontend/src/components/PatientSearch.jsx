import React, { useState } from 'react';
import api from '../api';

export default function PatientSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await api.get(`search/?name=${query}`);
    setResults(res.data);
  };

  return (
    <div>
      <h2>Search Patient</h2>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Patient Name" />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map(patient => (
          <li key={patient.id}>
            <button onClick={() => onSelect(patient)}>{patient.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 