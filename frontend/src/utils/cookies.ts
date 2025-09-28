// Cookie management utilities
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'touch_grass_auth_token',
  USER_ID: 'touch_grass_user_id'
};

// Set a cookie
export function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${window.location.protocol === 'https:'}`;
}

// Get a cookie value
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Delete a cookie
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCookie(COOKIE_NAMES.AUTH_TOKEN) !== null;
}

// Get current user's auth token
export function getAuthToken(): string | null {
  return getCookie(COOKIE_NAMES.AUTH_TOKEN);
}

// Get current user ID
export function getUserId(): string | null {
  return getCookie(COOKIE_NAMES.USER_ID);
}

// Clear all auth cookies
export function clearAuthCookies(): void {
  deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
  deleteCookie(COOKIE_NAMES.USER_ID);
}