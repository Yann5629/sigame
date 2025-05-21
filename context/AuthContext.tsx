import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password',
    role: 'user' as UserRole,
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin' as UserRole,
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored auth on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check local storage, AsyncStorage or secure storage
        // For demo purposes, we'll just set a timeout to simulate loading
        setTimeout(() => {
          // For demo purposes, let's say user is not logged in initially
          setUser(null);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user (This would be a real API call in production)
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Create user object without password
      const authenticatedUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      
      setUser(authenticatedUser);
      // In a real app, we would store the token in secure storage
      return;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists (This would be a real API call in production)
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create a new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name,
        email,
        role: 'user',
      };
      
      // In a real app, this would be an API call to create the user
      mockUsers.push({
        ...newUser,
        password,
      });
      
      setUser(newUser);
      // In a real app, we would store the token in secure storage
      return;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // In a real app, we would clear the token from secure storage
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  if (loading) {
    // You could return a loading component here
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};