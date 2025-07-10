import React, { useState } from 'react';
import api from '../api';

export default function FileUpload({ onJobCreated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/uploads/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onJobCreated(res.data.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input
        type="file"
        accept="text/csv"
        onChange={e => setFile(e.target.files[0])}
        className="upload-input"
      />
      <button type="submit" className="button" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload CSV'}
      </button>
    </form>
  );
}