import { API_BASE_URL } from '../config';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  let url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add token to query params if needed (based on backend API structure)
  if (token && !config.body) {
    const separator = endpoint.includes('?') ? '&' : '?';
    url = `${url}${separator}token=${encodeURIComponent(token)}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (response.status === 204) {
      return { success: true };
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: true, message: data.detail || 'An error occurred' };
    }
    
    return data;
  } catch (error) {
    return { error: true, message: error.message || 'Network error' };
  }
};

// User API
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/user/me?token=${encodeURIComponent(token)}`);
};

// Candidate API
export const uploadResume = async (file) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/candidate/upload_resume?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const data = await response.json();
      return { error: true, message: data.detail || 'Upload failed' };
    }
    
    return { success: true };
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const getMyResume = async () => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/candidate/my_resume?token=${encodeURIComponent(token)}`
    );
    
    if (!response.ok) {
      const data = await response.json();
      return { error: true, message: data.detail || 'Failed to fetch resume' };
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    return { success: true, url, blob };
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const deleteMyResume = async () => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/candidate/delete_my_resume?token=${encodeURIComponent(token)}`, {
    method: 'DELETE',
  });
};

// Jobs API - For candidates to view all jobs
export const getAllJobs = async (skip = 0, limit = 100) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/candidate/jobs?token=${encodeURIComponent(token)}&skip=${skip}&limit=${limit}`);
};

// Candidate Applications API
export const getMyApplications = async () => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/candidate/my_applications?token=${encodeURIComponent(token)}`);
};

export const applyToJob = async (jobId, coverLetter = null) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  const body = coverLetter ? { cover_letter: coverLetter } : {};
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/candidate/jobs/${jobId}/apply?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: true, message: data.detail || 'Application failed' };
    }
    
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Recruiter API
export const createJob = async (jobData) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/recruiter/jobs?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: true, message: data.detail || 'Failed to create job' };
    }
    
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const getMyJobs = async (skip = 0, limit = 100) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/recruiter/my_jobs?token=${encodeURIComponent(token)}&skip=${skip}&limit=${limit}`);
};

export const getJobApplications = async (jobId) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/recruiter/jobs/${jobId}/applications?token=${encodeURIComponent(token)}`);
};

// Admin API
export const getAllUsers = async (skip = 0, limit = 100) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/admin/users?token=${encodeURIComponent(token)}&skip=${skip}&limit=${limit}`);
};

export const getAdminJobs = async (skip = 0, limit = 100) => {
  const token = getToken();
  if (!token) return { error: true, message: 'No token found' };
  
  return apiCall(`/admin/jobs?token=${encodeURIComponent(token)}&skip=${skip}&limit=${limit}`);
};

// Contact API
export const sendContactMessage = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: true, message: data.detail || 'Failed to send message' };
    }

    return { success: true };
  } catch (error) {
    return { error: true, message: error.message || 'Network error' };
  }
};

