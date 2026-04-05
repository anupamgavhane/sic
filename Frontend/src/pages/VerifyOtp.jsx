import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearError } from '../features/auth/authSlice';
import { verifyOtp, resendOtp } from '../features/auth/authThunks';
import AnimatedBackground from '../components/AnimatedBackground';
import { MailCheck } from 'lucide-react';

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, email, isAuthenticated } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [timer, setTimer] = useState(0);

  const emailFromState = location.state?.email || email;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!emailFromState) {
      navigate('/register');
    }
  }, [emailFromState, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
      if (otpError) {
        setOtpError('');
      }
    }
  };

  const validateOtp = () => {
    if (!otp) {
      setOtpError('OTP is required');
      return false;
    }
    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return false;
    }
    return true;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateOtp()) {
      return;
    }

    await dispatch(
      verifyOtp({
        email: emailFromState,
        otp,
      })
    );
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendMessage('');
    dispatch(clearError());

    const result = await dispatch(resendOtp(emailFromState));

    setResendLoading(false);

    if (result.meta.requestStatus === 'fulfilled') {
      setResendMessage('OTP resent successfully!');
      setTimer(60);
      setTimeout(() => setResendMessage(''), 3000);
    }
  };

  return (
    <AnimatedBackground className="flex items-center justify-center p-4">
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/15 page-enter">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/15 shadow-lg">
              <MailCheck size={32} className="text-[#D2FF28]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
            <p className="text-[#D6F599]/80 text-sm">
              Enter the OTP sent to <span className="font-semibold text-white">{emailFromState}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[#C84C09]/20 border border-[#C84C09]/30 rounded-xl backdrop-blur-sm">
              <p className="text-[#C84C09] text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {resendMessage && (
            <div className="mb-4 p-3 bg-[#436436]/40 border border-[#436436]/50 rounded-xl backdrop-blur-sm">
              <p className="text-[#D6F599] text-sm text-center">{resendMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                One-Time Password (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                className={`w-full px-4 py-3.5 bg-white/8 border-2 rounded-xl text-center text-3xl tracking-[1em] focus:outline-none transition-all duration-300 text-white placeholder-white/20 backdrop-blur-sm ${
                  otpError ? 'border-[#C84C09]/50' : 'border-white/15 focus:border-[#D2FF28]/60 focus:ring-4 focus:ring-[#D6F599]/20'
                }`}
                placeholder="000000"
                disabled={loading}
              />
              {otpError && (
                <p className="text-[#C84C09] text-xs mt-2 text-center font-medium">{otpError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#D2FF28]/25 disabled:opacity-50 text-[#420217] font-bold py-3.5 px-4 rounded-xl transition-all duration-300 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#420217]/30 border-t-[#420217] rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm text-center mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={resendLoading || timer > 0}
              className="w-full py-2.5 px-4 border border-white/15 text-white/80 font-semibold rounded-xl hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : resendLoading ? (
                 <span className="flex items-center justify-center gap-2 text-sm">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Sending...
               </span>
              ) : (
                'Resend OTP'
              )}
            </button>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default VerifyOtp;
