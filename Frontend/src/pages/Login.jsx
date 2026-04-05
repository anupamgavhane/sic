import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { clearError } from '../features/auth/authSlice';
import { loginUser, googleLogin } from '../features/auth/authThunks';
import { GoogleLogin } from '@react-oauth/google';
import AnimatedBackground from '../components/AnimatedBackground';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.fromVerification) {
      setVerificationMessage('Email verified successfully! Please log in.');
      setTimeout(() => setVerificationMessage(''), 5000);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(
      loginUser({
        email: formData.email,
        password: formData.password,
      })
    );

    if (result.meta.requestStatus === 'rejected' && result.payload?.status === 403) {
      navigate('/verify-otp', { state: { email: formData.email } });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(googleLogin(credentialResponse.credential));
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <AnimatedBackground className="flex items-center justify-center p-4">
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/15 page-enter">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/15 shadow-lg">
              <LogIn size={26} className="text-[#D2FF28]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[#D6F599]/80">Sign in to your account</p>
          </div>

          {/* Verification Message */}
          {verificationMessage && (
            <div className="mb-4 p-3 bg-[#436436]/40 border border-[#436436]/50 rounded-xl backdrop-blur-sm">
              <p className="text-[#D6F599] text-sm flex items-center justify-center gap-2">
                {verificationMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[#C84C09]/20 border border-[#C84C09]/30 rounded-xl backdrop-blur-sm">
              <p className="text-[#C84C09] text-sm flex items-center justify-center gap-2 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#D6F599]/60" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-white/8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2FF28]/50 transition-all duration-300 text-white placeholder-white/30 backdrop-blur-sm ${
                    formErrors.email ? 'border-[#C84C09]/50' : 'border-white/15 focus:border-white/30'
                  }`}
                  placeholder="user@iiitn.ac.in"
                />
              </div>
              {formErrors.email && (
                <p className="text-[#C84C09] text-xs mt-1.5 font-medium">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#D6F599]/60" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-white/8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2FF28]/50 transition-all duration-300 text-white placeholder-white/30 backdrop-blur-sm ${
                    formErrors.password ? 'border-[#C84C09]/50' : 'border-white/15 focus:border-white/30'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {formErrors.password && (
                <p className="text-[#C84C09] text-xs mt-1.5 font-medium">{formErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#D2FF28]/20 disabled:opacity-50 text-[#420217] font-bold py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#420217]/30 border-t-[#420217] rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <hr className="flex-1 border-white/10" />
            <span className="px-3 text-[#D6F599]/60 text-sm font-medium">or</span>
            <hr className="flex-1 border-white/10" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                dispatch(clearError());
              }}
              size="large"
              width="350"
              theme="outline"
              text="continue_with"
              shape="rectangular"
            />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-white/50 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#D2FF28] hover:text-[#D6F599] font-semibold transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Login;
