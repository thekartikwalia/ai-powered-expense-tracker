'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            const data = await res.json();
            setError(data.error || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="w-80 p-6 shadow-lg rounded-xl border">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded p-2 mb-3"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded p-2 mb-3"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />
                {error && <p className="text-red-500 mb-3">{error}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    );
}
