import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'guru' | 'siswa';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string) => {
    try {
      // Check if running in Electron
      if (window.api) {
        const response = await window.api.login(username, password);
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          return { success: true, user: response.user };
        } else {
          return { success: false, error: response.error || 'Login failed' };
        }
      } else {
        // Fallback for Browser Development
        console.warn('Running in Browser Mode (Mock Login)');
        if (username === 'admin' && password === 'admin123') {
           const mockUser: User = { id: 1, username: 'admin', role: 'admin', name: 'Administrator' };
           setUser(mockUser);
           localStorage.setItem('user', JSON.stringify(mockUser));
           return { success: true, user: mockUser };
        }
        if (username === 'guru' && password === 'guru123') {
            const mockUser: User = { id: 2, username: 'guru', role: 'guru', name: 'Bapak Guru' };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            return { success: true, user: mockUser };
         }
         if (username === 'siswa' && password === 'siswa123') {
            const mockUser: User = { id: 3, username: 'siswa', role: 'siswa', name: 'Siswa Teladan' };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            return { success: true, user: mockUser };
         }
        return { success: false, error: 'Invalid credentials (Mock: admin/admin123, guru/guru123, siswa/siswa123)' };
      }
    } catch (error) {
      console.error('Login error', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Add global type definition for window.api
declare global {
  interface Window {
    api?: {
      login: (username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
      addStudent: (data: { nik: string; name: string; kelas: string }) => Promise<{ success: boolean; id?: number; error?: string }>;
      getStudents: () => Promise<{ success: boolean; students?: any[]; error?: string }>;
      getClasses: () => Promise<{ success: boolean; classes?: any[]; error?: string }>;
      addClass: (name: string) => Promise<{ success: boolean; id?: number; error?: string }>;
      deleteClass: (id: number) => Promise<{ success: boolean; error?: string }>;
      getExamResults: (studentId?: number) => Promise<{ success: boolean; results?: any[]; error?: string }>;
      addExamResult: (data: { studentId: number; moduleId: string; score: number; type: string }) => Promise<{ success: boolean; id?: number; error?: string }>;
      getDashboardStats: () => Promise<{ success: boolean; stats?: any; error?: string }>;
    };
  }
}
