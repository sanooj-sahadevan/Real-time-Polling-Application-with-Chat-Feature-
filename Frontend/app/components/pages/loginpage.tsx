/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { LoginAPI } from "@/services/userApi";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    try {
      const result = await LoginAPI(data);
      console.log("LoginAPI result:", result); 
      console.log('suk');

      if (result && result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Login Successful!");
        router.push(`/home`);
        // window.location.href = "/"; 
      } else {
        toast.error("Invalid login credentials. Please try again.");
        
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || "An error occurred. Please try again.", { autoClose: 5000 });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg ring-2 ring-teal-400">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Welcome Back!</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address',
                }
              })}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account? <a href="/signup" className="text-teal-600 hover:text-teal-700">Sign Up</a>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
