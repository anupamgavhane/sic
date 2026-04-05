import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearError } from '../features/auth/authSlice';
import { registerUser } from '../features/auth/authThunks';
import AnimatedBackground from '../components/AnimatedBackground';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!formData.email.endsWith('@iiitn.ac.in')) {
      errors.email = 'Only institute email (@iiitn.ac.in) is allowed';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

    const userData = {
      fullName: {
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      email: formData.email,
      password: formData.password,
    };

    const result = await dispatch(registerUser(userData));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/verify-otp', { state: { email: formData.email } });
    }
  };

  return (
    <AnimatedBackground className="flex items-center justify-center p-4">
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/15 page-enter my-8">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/15 shadow-lg">
              <UserPlus size={26} className="text-[#D2FF28]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-[#D6F599]/80">Join SharingIsCaring to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[#C84C09]/20 border border-[#C84C09]/30 rounded-xl backdrop-blur-sm">
              <p className="text-[#C84C09] text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-[#D6F599]/60" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 bg-white/8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2FF28]/50 transition-all duration-300 text-white placeholder-white/30 backdrop-blur-sm text-sm ${
                      formErrors.firstName ? 'border-[#C84C09]/50' : 'border-white/15 focus:border-white/30'
                    }`}
                    placeholder="John"
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-[#C84C09] text-xs mt-1 font-medium">{formErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white/8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2FF28]/50 transition-all duration-300 text-white placeholder-white/30 backdrop-blur-sm text-sm ${
                    formErrors.lastName ? 'border-[#C84C09]/50' : 'border-white/15 focus:border-white/30'
                  }`}
                  placeholder="Doe"
                />
                {formErrors.lastName && (
                  <p className="text-[#C84C09] text-xs mt-1 font-medium">{formErrors.lastName}</p>
                )}
              </div>
            </div>

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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#D6F599]/60" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-white/8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2FF28]/50 transition-all duration-300 text-white placeholder-white/30 backdrop-blur-sm ${
                    formErrors.confirmPassword ? 'border-[#C84C09]/50' : 'border-white/15 focus:border-white/30'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {formErrors.confirmPassword && (
                <p className="text-[#C84C09] text-xs mt-1.5 font-medium">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#D2FF28]/25 disabled:opacity-50 text-[#420217] font-bold py-3 px-4 rounded-xl transition-all duration-300 mt-4 cursor-pointer"
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-2">
                 <div className="w-5 h-5 border-2 border-[#420217]/30 border-t-[#420217] rounded-full animate-spin" />
                 Registering...
               </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D2FF28] hover:text-[#D6F599] font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Register;
