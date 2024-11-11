import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(username, password);
      
      if (!response.access_token) {
        console.error('Login error: Invalid response from server');
        return false; // Falha no login
      }

      const userData = { 
        username, 
        role: response.role || 'user'
      };

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return true; // Login bem-sucedido
    } catch (error) {
      console.error('Login error:', error);
      return false; // Falha no login
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
