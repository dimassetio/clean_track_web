'use client'

import { signInAndGetUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser, setUserType } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { authUser, firestoreUser } = await signInAndGetUser(email, password);
      setUser(authUser);
      setUserType(firestoreUser);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">Clean Track Admin</h2>
        <p className="text-center text-gray-500 mb-6">Sign in to your admin account</p>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          onClick={handleLogin}
        >
          {isLoading ? 'Please wait...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
