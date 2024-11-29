import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { FaArrowLeft } from 'react-icons/fa';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(username, password);
      setToken(token);
      localStorage.setItem('auth_token', JSON.stringify(token));
      localStorage.setItem('username', username);

      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-blue-500 hover:underline mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Voltar para Home
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Faça o Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">
              Nome de usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all font-semibold text-lg"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/signup"
              className="text-blue-500 hover:underline font-medium"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
