import { useState, useEffect } from "react";

// Types for user authentication
export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: string;
}

// Types for authentication state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Local storage keys
const AUTH_USER_KEY = "digital-tasbih-auth-user";

// Mock user database (in a real app, this would be in a backend)
const MOCK_USERS: Record<string, User> = {};

// Helper to generate a unique ID
const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Save user to local storage
export const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
};

// Get user from local storage
export const getUserFromStorage = (): User | null => {
  try {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error("Error getting user from storage:", error);
    return null;
  }
};

// Clear user from local storage
export const clearUserFromStorage = (): void => {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.error("Error clearing user from storage:", error);
  }
};

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  name: string,
): Promise<User> => {
  // Check if email already exists
  if (Object.values(MOCK_USERS).some((user) => user.email === email)) {
    throw new Error("Email already in use");
  }

  // Create new user
  const newUser: User = {
    id: generateId(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };

  // In a real app, this would be a backend API call
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Save to mock database
  MOCK_USERS[newUser.id] = newUser;

  // Save to local storage
  saveUserToStorage(newUser);

  return newUser;
};

// Login user
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  // In a real app, this would be a backend API call
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find user by email
  const user = Object.values(MOCK_USERS).find((u) => u.email === email);

  if (!user) {
    // For demo purposes, create a user if not found
    const newUser: User = {
      id: generateId(),
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    };

    MOCK_USERS[newUser.id] = newUser;
    saveUserToStorage(newUser);
    return newUser;
  }

  // Save to local storage
  saveUserToStorage(user);

  return user;
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  // In a real app, this would be a backend API call
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Clear from local storage
  clearUserFromStorage();
};

// Custom hook for authentication
export const useAuth = (): AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = () => {
      try {
        const user = getUserFromStorage();
        setAuthState({
          user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          error: "Failed to initialize authentication",
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await loginUser(email, password);
      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await registerUser(email, password, name);
      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  // Logout function
  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      await logoutUser();
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      }));
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
