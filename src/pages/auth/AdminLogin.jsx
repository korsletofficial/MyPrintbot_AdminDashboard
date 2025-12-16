import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { authAPI } from '../../api/endpoints/auth';
import { useAdminAuthStore } from '../../stores/authStore';
import printbotLogo from '../../assets/printbot-logo.png';
import loginBanner from '../../assets/login-banner.png';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useAdminAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await authAPI.login(data);
      const responseData = response.data.data || response.data;
      const { user, token } = responseData;

      // Ensure user is admin
      if (user.userType !== 'ADMIN') {
        setError('Access denied. Admin credentials required.');
        setIsLoading(false);
        return;
      }

      // Store user and token
      login(user, token);

      // Redirect to admin dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src={printbotLogo}
                alt="MyPrintBot Logo"
                className="h-16 w-auto"
              />
            </div>

            {/* Welcome Back Title */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-8 h-8 text-[#1e3a8a]" />
                <h1 className="text-3xl font-bold text-[#1e3a8a]">Admin Portal</h1>
              </div>
              <p className="text-sm text-gray-500">
                Secure access for system administrators
              </p>
            </div>

            {/* Admin Badge */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800 font-medium">
                Administrator Login Only
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@myprintbot.com"
                    {...register('email')}
                    disabled={isLoading}
                    className="pl-10 h-11 border-gray-300"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    disabled={isLoading}
                    className="pl-10 pr-10 h-11 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                />
                <div className="flex flex-col">
                  <Label htmlFor="remember" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Remember me
                  </Label>
                  <span className="text-xs text-gray-500">Keep me logged in for 30 days</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-6">
              <p className="text-xs text-yellow-800">
                <span className="font-semibold">Security Notice:</span> This is a restricted area.
                All login attempts are logged and monitored.
              </p>
            </div>

            {/* Copyright */}
            <p className="text-center text-xs text-gray-400 mt-8">
              Copyright 2025 MyPrintBot Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Banner Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 z-10"></div>
        <img
          src={loginBanner}
          alt="Admin Login Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <Shield className="w-24 h-24 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Admin Dashboard</h2>
            <p className="text-lg opacity-90">
              Manage your platform with powerful tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
