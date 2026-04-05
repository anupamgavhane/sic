import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import api from '../api/axios';
import { ArrowLeft, Mail, ShieldCheck, Calendar, Clock } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/users/${userId}`);
        setProfileData(response.data.user);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return (
    <AnimatedBackground className="flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-white/50 hover:text-[#D6F599] transition-all duration-300 font-medium text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back
        </button>

        <div className="bg-white/8 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/15">
          {/* Header Banner */}
          <div className="h-36 bg-gradient-to-r from-[#436436]/40 via-[#420217]/60 to-[#C84C09]/40 backdrop-blur-sm border-b border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          </div>
          
          <div className="px-8 pb-10">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-2xl p-1.5 shadow-xl border border-white/20 rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-[#436436] to-[#C84C09] rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                  {profileData?.fullName?.firstName?.charAt(0) || '?'}
                  {profileData?.fullName?.lastName?.charAt(0) || '?'}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D2FF28]"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-[#C84C09]/20 text-white rounded-xl border border-[#C84C09]/40 backdrop-blur-sm">
                {error}
              </div>
            ) : profileData ? (
              <>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profileData.fullName.firstName} {profileData.fullName.lastName}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-white/50 mb-8 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} />
                    {profileData.email}
                  </span>
                  {profileData.isVerified && (
                    <span className="flex items-center gap-1 text-[#D6F599] text-xs font-medium bg-[#436436]/50 px-2.5 py-1 rounded-full border border-[#436436]/40 backdrop-blur-sm">
                      <ShieldCheck size={12} />
                      Verified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:bg-white/12 transition-all duration-300 group hover:border-[#D6F599]/30">
                    <div className="flex items-center gap-2 text-white/40 mb-2 group-hover:text-[#D6F599]/70 transition-colors">
                      <Calendar size={14} />
                      <p className="text-xs font-medium uppercase tracking-wider">Joined Date</p>
                    </div>
                    <p className="text-white font-semibold flex items-center gap-2">
                       {new Date(profileData.createdAt).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:bg-white/12 transition-all duration-300 group hover:border-[#D6F599]/30">
                    <div className="flex items-center gap-2 text-white/40 mb-2 group-hover:text-[#D6F599]/70 transition-colors">
                      <Clock size={14} />
                      <p className="text-xs font-medium uppercase tracking-wider">Last Active</p>
                    </div>
                    <p className="text-white font-semibold">
                      {new Date(profileData.lastActive).toLocaleString([], {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Profile;
