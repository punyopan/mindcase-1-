/**
 * Secure Authentication Service (Client Side)
 * Connects to Backend API.
 * Manages Access Tokens in memory.
 */

const API_URL = 'http://localhost:3000/api/auth';

// Internal state (Memory Storage)
let _accessToken = null;
let _currentUser = null;

export class AuthService {
  
  /**
   * Initialize session (Check for valid Refresh Token cookie)
   */
  static async checkSession() {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
          const data = await response.json();
          _accessToken = data.accessToken;
          // Decode user from token OR fetch profile. 
          // For simplicity, let's assume /refresh returns user payload in token or we decode it.
          // In our backend controller, /refresh returns { accessToken }. 
          // We need to decode the token to get the user part.
          _currentUser = this._decodeToken(_accessToken);
          return _currentUser;
      }
    } catch (e) {
      console.warn('Session check failed:', e);
    }
    return null;
  }

  static async register({ email, password, name }) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      _accessToken = data.accessToken;
      _currentUser = data.user;
      return { success: true, user: _currentUser };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static async login({ email, password }) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      _accessToken = data.accessToken;
      _currentUser = data.user;
      return { success: true, user: _currentUser };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static async loginAsGuest() {
     try {
      const response = await fetch(`${API_URL}/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Guest login failed');

      _accessToken = data.accessToken;
      _currentUser = data.user;
      return { success: true, user: _currentUser };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static async logout() {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    }
    _accessToken = null;
    _currentUser = null;
    // Clear any local storage leftovers just in case
    localStorage.removeItem('mindcase_auth_v2'); 
    return { success: true };
  }

  static getCurrentUser() {
    return _currentUser;
  }
  
  static getAccessToken() {
      return _accessToken;
  }

  static _decodeToken(token) {
      try {
          const payload = token.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          return {
              id: decoded.uid,
              role: decoded.role,
              is_guest: decoded.is_guest,
              // We might need to store more in the token or fetch profile if name/email are needed
              // For now, let's assume the UI handles "Loading..." if missing details
              // Or better, we can assume the User ID is enough for most logic
          };
      } catch (e) {
          return null;
      }
  }
}
