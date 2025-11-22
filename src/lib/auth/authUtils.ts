// Centralized error handling utility
export interface ApiError {
  data?: {
    message?: string | string[];
  };
  message?: string;
}

export const handleApiError = (error: unknown): string => {
  // Type guard to check if error has expected structure
  if (typeof error === "object" && error !== null) {
    const err = error as {
      data?: { message?: string | string[] };
      message?: string;
      status?: string;
      code?: string;
    };

    if (err.data?.message) {
      const message = err.data.message;
      // Handle array of messages from backend
      if (Array.isArray(message)) {
        return message.join(", ");
      }
      return message;
    }

    if (err.message) {
      return err.message;
    }

    // Handle network errors
    if (err.status === "network" || err.code === "NETWORK_ERROR") {
      return "Network error. Please check your connection and try again.";
    }

    // Handle timeout errors
    if (err.status === "timeout" || err.code === "TIMEOUT") {
      return "Request timed out. Please try again.";
    }
  }

  // Default fallback
  return "An unexpected error occurred. Please try again.";
};

// Simple cookie utilities for authentication
export const cookies = {
  set: (name: string, value: string, days: number = 7): void => {
    if (typeof window === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;samesite=strict`;
  },

  get: (name: string): string | null => {
    if (typeof window === "undefined") return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  remove: (name: string): void => {
    if (typeof window === "undefined") return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;samesite=strict`;
  },

  clear: (): void => {
    if (typeof window === "undefined") return;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;samesite=strict`;
    }
  },
};

// Auth token utilities using cookies
export const authStorage = {
  setTokens: (accessToken: string, refreshToken?: string): void => {
    // Set access token cookie (7 days)
    cookies.set("authToken", accessToken, 7);

    // Set refresh token cookie (30 days)
    if (refreshToken) {
      cookies.set("refreshToken", refreshToken, 30);
    }
  },

  getAccessToken: (): string | null => {
    return cookies.get("authToken");
  },

  getRefreshToken: (): string | null => {
    return cookies.get("refreshToken");
  },

  clearTokens: (): void => {
    cookies.remove("authToken");
    cookies.remove("refreshToken");
  },

  isAuthenticated: (): boolean => {
    const token = authStorage.getAccessToken();
    return !!token && token.length > 0;
  },
};

// Email validation utility
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export interface PasswordValidation {
  isValid: boolean;
  score: number; // 0-4 (0: very weak, 4: very strong)
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export const validatePassword = (password: string): PasswordValidation => {
  const feedback: string[] = [];
  const requirements = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  let score = 0;

  // Check minimum length
  if (requirements.minLength) {
    score += 1;
  } else {
    feedback.push("Password must be at least 8 characters long");
  }

  // Check character variety
  if (requirements.hasUpper) score += 1;
  else feedback.push("Include at least one uppercase letter");

  if (requirements.hasLower) score += 1;
  else feedback.push("Include at least one lowercase letter");

  if (requirements.hasNumber) score += 1;
  else feedback.push("Include at least one number");

  if (requirements.hasSpecial) {
    score += 1;
  } else {
    feedback.push("Include at least one special character");
  }

  // Bonus for longer passwords
  if (password.length >= 12) score += 1;

  const isValid = Object.values(requirements).every(Boolean);

  return {
    isValid,
    score,
    feedback,
    requirements,
  };
};

// Session management
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
  private static timeoutId: NodeJS.Timeout | null = null;
  private static warningId: NodeJS.Timeout | null = null;

  static start() {
    this.clear();

    // Set timeout for session expiry
    this.timeoutId = setTimeout(() => {
      this.handleSessionExpiry();
    }, this.SESSION_TIMEOUT);

    // Set warning before expiry
    this.warningId = setTimeout(() => {
      this.handleSessionWarning();
    }, this.SESSION_TIMEOUT - this.WARNING_TIME);

    // Save session start time
    sessionStorage.setItem("sessionStartTime", Date.now().toString());
  }

  static clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.warningId) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }
  }

  static reset() {
    this.clear();
    this.start();
  }

  private static handleSessionExpiry() {
    // Dispatch custom event for session expiry
    window.dispatchEvent(new CustomEvent("sessionExpiry"));
    this.clear();
  }

  private static handleSessionWarning() {
    // Dispatch custom event for session warning
    window.dispatchEvent(new CustomEvent("sessionWarning"));
  }

  static getRemainingTime(): number {
    const startTime = parseInt(
      sessionStorage.getItem("sessionStartTime") || "0"
    );
    if (!startTime) return 0;

    const elapsed = Date.now() - startTime;
    return Math.max(0, this.SESSION_TIMEOUT - elapsed);
  }
}

// Rate limiting utility
export class RateLimiter {
  private static readonly OTP_LIMIT = 3; // Max 3 OTP requests
  private static readonly OTP_WINDOW = 60 * 1000; // Per minute

  static canRequestOtp(): boolean {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem("otpRequests") || "[]");

    // Filter requests within the time window
    const recentRequests = requests.filter(
      (timestamp: number) => now - timestamp < this.OTP_WINDOW
    );

    return recentRequests.length < this.OTP_LIMIT;
  }

  static recordOtpRequest(): boolean {
    if (!this.canRequestOtp()) {
      return false;
    }

    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem("otpRequests") || "[]");
    const recentRequests = requests.filter(
      (timestamp: number) => now - timestamp < this.OTP_WINDOW
    );

    recentRequests.push(now);
    localStorage.setItem("otpRequests", JSON.stringify(recentRequests));

    return true;
  }

  static getRemainingRequests(): number {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem("otpRequests") || "[]");
    const recentRequests = requests.filter(
      (timestamp: number) => now - timestamp < this.OTP_WINDOW
    );

    return Math.max(0, this.OTP_LIMIT - recentRequests.length);
  }

  static getResetTime(): number {
    const requests = JSON.parse(localStorage.getItem("otpRequests") || "[]");
    if (requests.length === 0) return 0;

    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.OTP_WINDOW - Date.now();
  }
}
