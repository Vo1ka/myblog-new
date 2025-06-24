'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserThunk } from '@/store/auth/thunks';
import type { RootState, AppDispatch } from '@/store';
import Link from 'next/link';

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk(email, password, displayName));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto bg-white rounded-lg shadow p-6 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-center mb-2">Регистрация</h2>

      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      <input
        type="text"
        className="border rounded px-3 py-2 focus:outline-blue-400"
        placeholder="Имя пользователя"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        required
        minLength={2}
        autoComplete="nickname"
      />
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
        minLength={6}
        autoComplete="new-password"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
      </button>

      <div className="text-center text-gray-500 text-sm">
        Уже есть аккаунт?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Войти
        </Link>
      </div>
    </form>
  );
}
