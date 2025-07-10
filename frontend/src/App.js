import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [jobId, setJobId] = useState(null);

  return (
    <div className="container">
      <h1>Sensor Anomaly Dashboard</h1>
      {!jobId && <FileUpload onJobCreated={setJobId} />}
      {jobId && <Dashboard jobId={jobId} />}
    </div>
  );
}

export default App;