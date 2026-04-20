"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem("fluentroUser", email);
      router.push("/dashboard");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to Fluentro
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-white/20 placeholder-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full mb-4 p-3 rounded-xl bg-white/20 placeholder-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 cursor-pointer text-sm"
          >
            {showPass ? "Hide" : "Show"}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          New here? <span className="underline cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
}