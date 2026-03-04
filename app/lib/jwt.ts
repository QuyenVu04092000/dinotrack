// File: app/lib/jwt.ts

/**
 * Decode JWT token and return payload
 */
export function decodeJWT(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is valid (not expired), false if expired or invalid
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    const decoded = decodeJWT(token);
    if (!decoded) {
      return false;
    }

    // Check if token has expiration (exp claim)
    if (decoded.exp) {
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // Add 5 minute buffer to account for clock skew
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

      return currentTime < expirationTime - bufferTime;
    }

    // If no expiration claim, consider it valid (though this is unusual)
    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpiration(token: string | null): number | null {
  if (!token) {
    return null;
  }

  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return decoded.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
}
