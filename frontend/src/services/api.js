//unused by tanish for future implementation



const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  async registerUser(registrationData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },
  
  async requestChallenge(username) {
    const response = await fetch(`${API_BASE_URL}/auth/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Challenge request failed');
    }
    
    return response.json();
  },
  
  async verifyLogin(verifyData) {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login verification failed');
    }
    
    return response.json();
  }
};
