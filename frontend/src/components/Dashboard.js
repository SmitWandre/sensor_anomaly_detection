import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import api from '../api';
import {
  LineChart, Line,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const BACKEND_URL = 'http://localhost:8000';  

export default function Dashboard({ jobId }) {
  const [status, setStatus] = useState('pending');
  const [data, setData]     = useState([]);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await api.get(`/uploads/${jobId}/`);
      setStatus(res.data.status);

      if (res.data.status === 'completed') {
        clearInterval(interval);

        const result   = await api.get(`/uploads/${jobId}/results/`);
        const csvPath  = result.data.result_file; 
        const fetchUrl = `${BACKEND_URL}${csvPath}`; 
        const csvRes   = await fetch(fetchUrl);
        const text     = await csvRes.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
          dynamicTyping: true,
          complete: p => {
            const cleaned = p.data
              .map(row => {
                if (typeof row.timestamp !== 'string') return null;
                const tsIso = row.timestamp.trim().replace(' ', 'T') + 'Z';
                return {
                  timestamp: Date.parse(tsIso),
                  temp_mean: row.temp_mean,
                  hum_mean:  row.hum_mean,
                  cluster:   row.cluster,
                };
              })
              .filter(Boolean);

            console.log('Dashboard CSV data:', cleaned);
            setData(cleaned);
          },
          error: err => console.error('CSV parse error:', err),
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  if (!jobId) return null;
  if (status !== 'completed') return <p>Job status: {status}</p>;

  return (
    <div className="dashboard">
      <h2>Temperature Over Time</h2>
      <LineChart width={800} height={300} data={data}>
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={['auto','auto']}
          tickFormatter={ts => new Date(ts).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip labelFormatter={ts => new Date(ts).toLocaleString()} />
        <CartesianGrid />
        <Line type="monotone" dataKey="temp_mean" stroke="#007bff" dot />
      </LineChart>

      <h2>Temp vs Humidity Clusters</h2>
      <ScatterChart
        width={800}
        height={300}
        data={data}
        margin={{ top:20, right:20, bottom:20, left:20 }}
      >
        <XAxis dataKey="temp_mean" name="Temp (°C)"    unit="°C" />
        <YAxis dataKey="hum_mean"  name="Humidity (%)" unit="%" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#007bff" />
      </ScatterChart>
    </div>
  );
}
