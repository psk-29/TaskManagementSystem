
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from "@/types/auth";

// Mock API for auth functions
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be a fetch call to your backend
  if (credentials.email === "user@example.com" && credentials.password === "password") {
    return {
      user: {
        id: "1",
        name: "Demo User",
        email: "user@example.com",
        role: "user"
      },
      token: "mock-jwt-token"
    };
  }
  
  throw new Error("Invalid credentials");
};

const mockRegister = async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be a fetch call to your backend
  if (credentials.password !== credentials.confirmPassword) {
    throw new Error("Passwords do not match");
  }
  
  return {
    user: {
      id: "2",
      name: credentials.name,
      email: credentials.email,
      role: "user"
    },
    token: "mock-jwt-token"
  };
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  authState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  },
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Load auth state from localStorage on component mount
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedToken) {
          setAuthState({
            user: JSON.parse(storedUser),
            token: storedToken,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await mockLogin(credentials);
      
      // Store auth data in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await mockRegister(credentials);
      
      // Store auth data in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
