'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function LoginPage() {
//   console.log("LoginPage rendered");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // Redirect based on role
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <div>
    <header className="w-full p-4 bg-[#38040e] text-[#fff9ec] flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold uppercase tracking-wide">Parlour</h1>
      </header>
    <div className="flex mt-[10%] items-center justify-center align-middle my-auto">
      <div className="w-full max-w-sm space-y-4 bg-[#E7D7C1] p-10 rounded-2xl border-4 border-[#A78A7F]">
        <h1 className="text-4xl font-bold">Login</h1>
        <Input className='bg-white border-2 border-[#A78A7F]' placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input
          className='bg-white border-2 border-[#A78A7F]'
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full bg-[#38040e] rounded-full" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
    </div>
  );
}