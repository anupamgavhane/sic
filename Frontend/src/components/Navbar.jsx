import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../features/auth/authThunks';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, DoorOpen, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#D2FF28] to-[#D6F599] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <span className="text-[#420217] font-extrabold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block group-hover:text-[#D6F599] transition-colors">
                SIC
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/dashboard')
                  ? 'bg-[#436436]/40 text-[#D6F599] shadow-sm border border-[#436436]/50'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link
              to="/rooms"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/rooms')
                  ? 'bg-[#436436]/40 text-[#D6F599] shadow-sm border border-[#436436]/50'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <DoorOpen size={16} />
              Rooms
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white leading-tight group-hover:text-[#D6F599] transition-colors">{user.fullName?.firstName} {user.fullName?.lastName}</p>
                    <p className="text-[11px] text-white/40">{user.email}</p>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-[#C84C09] to-[#436436] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white/20 group-hover:ring-[#D2FF28]/50 transition-all duration-300">
                    {user.fullName?.firstName?.[0]}{user.fullName?.lastName?.[0]}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C84C09]/20 hover:bg-[#C84C09]/40 border border-[#C84C09]/30 text-white text-sm font-medium transition-all duration-300 cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-white/70 hover:text-[#D2FF28] hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-white/10 pt-3 page-enter">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/dashboard') ? 'bg-[#436436]/40 text-[#D6F599]' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link
              to="/rooms"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/rooms') ? 'bg-[#436436]/40 text-[#D6F599]' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <DoorOpen size={16} />
              Rooms
            </Link>
            {user && (
              <>
                <div className="px-3 py-2.5 border-t border-white/10 mt-2 pt-3">
                  <p className="text-white font-medium text-sm hover:text-[#D6F599]">{user.fullName?.firstName} {user.fullName?.lastName}</p>
                  <p className="text-white/40 text-xs">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium bg-[#C84C09]/20 text-white hover:bg-[#C84C09]/40 transition-all duration-300 cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
