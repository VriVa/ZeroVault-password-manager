const BASE_URL = 'http://localhost:5000'; // adjust if needed

export async function register(payload) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function requestChallenge(username) {
  const res = await fetch(`${BASE_URL}/auth/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  return res.json();
}

export async function verifyLogin(payload) {
  const res = await fetch(`${BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
// Add to utils/api.js
export async function getVault() {
  const sessionToken = localStorage.getItem('session_token');
  if (!sessionToken) return { status: 'error', message: 'Missing session token' };
  const res = await fetch(`${BASE_URL}/vault`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    }
  });
  return res.json();
}

export async function updateVault(vault_blob) {
  const sessionToken = localStorage.getItem('session_token');
  if (!sessionToken) return { status: 'error', message: 'Missing session token' };
  const res = await fetch(`${BASE_URL}/vault`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({ vault_blob })
  });
  return res.json();
}

// Plain entries API (no encryption)
export async function addPlainEntry(entry) {
  const sessionToken = localStorage.getItem('session_token');
  if (!sessionToken) return { status: 'error', message: 'Missing session token' };
  const res = await fetch(`${BASE_URL}/vault/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({ entry })
  });
  return res.json();
}

export async function getPlainEntries() {
  const sessionToken = localStorage.getItem('session_token');
  if (!sessionToken) return { status: 'error', message: 'Missing session token' };
  const res = await fetch(`${BASE_URL}/vault/entries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    }
  });
  return res.json();
}

export async function deletePlainEntry(entryId) {
  const sessionToken = localStorage.getItem('session_token');
  if (!sessionToken) return { status: 'error', message: 'Missing session token' };
  const res = await fetch(`${BASE_URL}/vault/entries/${entryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    }
  });
  return res.json();
}

export async function logout() {
  const sessionToken = localStorage.getItem('session_token');
  if (!sessionToken) return { status: 'error', message: 'Missing session token' };
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    }
  });
  return res.json();
}