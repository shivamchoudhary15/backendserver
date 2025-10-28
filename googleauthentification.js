// googleAuthentication.js
// ES module for Google Sign-In (Google Identity Services)
// Usage: import { initGoogleAuth, signOut } from './googleAuthentication.js'
// Make sure you include <script src="https://accounts.google.com/gsi/client" async defer></script>
// in your HTML before using this module.

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // <- replace

let gis;               // google.accounts.id object
let tokenCallback = null;
let userCredential = null;

/**
 * initGoogleAuth
 * - options:
 *    - buttonId: DOM id of element where the Google button will render
 *    - callback: function(idToken) { ... } called when user signs in successfully
 *    - uxMode: "popup" or "redirect" (default "popup")
 *    - autoPrompt: boolean - whether to auto prompt One Tap (default false)
 */
export function initGoogleAuth({
  buttonId = 'gsi-button',
  callback = null,
  uxMode = 'popup',
  autoPrompt = false,
} = {}) {
  if (!CLIENT_ID || CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
    console.error('Please set your Google CLIENT_ID in googleAuthentication.js');
    return;
  }

  tokenCallback = callback;

  // Wait until the GIS script has loaded
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.error('Google Identity Services script not loaded. Include <script src="https://accounts.google.com/gsi/client" async defer></script> in your HTML.');
    return;
  }

  gis = window.google.accounts.id;

  // Initialize the library
  gis.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
    ux_mode: uxMode, // popup | redirect
  });

  // Render the button
  const container = document.getElementById(buttonId);
  if (container) {
    gis.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
    });
  } else {
    console.warn(`Container element with id="${buttonId}" not found. You can still call gis.prompt() manually.`);
  }

  if (autoPrompt) {
    // Shows One Tap / auto prompt if available
    gis.prompt();
  }
}

/**
 * handleCredentialResponse
 * Internal callback registered with GIS. Receives response.credential (JWT ID token).
 */
function handleCredentialResponse(response) {
  if (!response || !response.credential) {
    console.error('No credential returned from Google.');
    return;
  }

  const idToken = response.credential;
  // Optionally decode the JWT on client for display (not for trust)
  try {
    const payload = parseJwt(idToken);
    userCredential = payload;
  } catch (e) {
    console.warn('Failed to decode ID token locally:', e);
  }

  // Pass the token to user-provided callback (e.g., to send to your backend)
  if (typeof tokenCallback === 'function') {
    tokenCallback(idToken, userCredential);
  } else {
    console.log('ID token received. No callback provided. Payload:', userCredential);
  }
}

/**
 * sendIdTokenToBackend
 * Example helper that posts the ID token to your server for verification.
 * - endpoint: '/auth/google' (example)
 */
export async function sendIdTokenToBackend(idToken, endpoint = '/auth/google') {
  if (!idToken) throw new Error('idToken required');
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    credentials: 'include',
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Server error: ${resp.status} ${txt}`);
  }
  return resp.json();
}

/**
 * signOut
 * Optionally revoke token (best-effort) and clear One Tap auto prompt.
 */
export function signOut() {
  // Revoke tokens by calling Google's revoke endpoint (best-effort; requires an access token or email)
  // Since GIS returns only an ID token by default, full revocation often requires server-side revocation.
  userCredential = null;
  if (gis && gis.cancel) {
    // Cancel any pending One Tap prompt
    try { gis.cancel(); } catch (e) {}
  }
  console.log('Local sign-out completed.');
}

/**
 * parseJwt
 * Lightweight JWT payload parser for ID token decoding on client (for display only).
 */
function par
