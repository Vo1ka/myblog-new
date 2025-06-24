'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk } from '@/store/auth/thunks';
import type { RootState, AppDispatch } from '@/store';
import Link from 'next/link';

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk(email, password));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto bg-white rounded-lg shadow p-6 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-center mb-2">Вход</h2>

      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      <input
        type="email"
        className="border rounded px-3 py-2 focus:outline-blue-400"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <input
        type="password"
        className="border rounded px-3 py-2 focus:outline-blue-400"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Входим...' : 'Войти'}
      </button>

      <div className="text-center text-gray-500 text-sm">
        Нет аккаунта?{' '}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Зарегистрируйтесь
        </Link>
      </div>
    </form>
  );
}
