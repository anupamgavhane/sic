import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import useAuth from '../hooks/useAuth';
import { fetchRooms, fetchMyRooms, joinRoom } from '../features/rooms/roomThunks';
import { Car, UtensilsCrossed, ShoppingCart, Salad, Package, Plus, Search, Users } from 'lucide-react';

const CATEGORY_STYLES = {
  ride: { bg: 'bg-[#436436]/50', text: 'text-[#D6F599]', border: 'border-[#436436]/30', Icon: Car },
  food: { bg: 'bg-[#C84C09]/30', text: 'text-white', border: 'border-[#C84C09]/30', Icon: UtensilsCrossed },
  ecommerce: { bg: 'bg-[#420217]/50', text: 'text-[#D2FF28]', border: 'border-[#420217]/30', Icon: ShoppingCart },
  grocery: { bg: 'bg-[#D6F599]/20', text: 'text-[#D6F599]', border: 'border-[#D6F599]/30', Icon: Salad },
  other: { bg: 'bg-white/10', text: 'text-white/80', border: 'border-white/20', Icon: Package },
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { rooms, myActiveRooms, loading } = useSelector((state) => state.rooms);
  
  const [activeTab, setActiveTab] = useState('my-rooms');

  useEffect(() => {
    dispatch(fetchMyRooms());
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleJoin = async (roomId) => {
    const result = await dispatch(joinRoom(roomId));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/chat/${roomId}`);
    }
  };

  const handleEnterRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const renderRoomCard = (room, memberOfRoom, index) => {
    const catStyle = CATEGORY_STYLES[room.category] || CATEGORY_STYLES.other;
    const CatIcon = catStyle.Icon;
    const spotsLeft = room.maxMembers - (room.members?.length || 0);

    return (
      <div
        key={room._id}
        className="card-enter bg-white/8 backdrop-blur-lg rounded-2xl shadow-lg border border-white/15 hover:scale-[1.03] hover:shadow-2xl hover:bg-white/12 hover:border-[#D6F599]/30 transition-all duration-300 overflow-hidden flex flex-col"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className="p-5 flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border} backdrop-blur-sm`}>
              <CatIcon size={12} />
              {room.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{room.title}</h3>

          {room.description && (
            <p className="text-sm text-white/50 mb-3 line-clamp-2">{room.description}</p>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-white/45">
              <Users size={13} />
              {room.members?.length || 0}/{room.maxMembers}
            </span>
            {spotsLeft > 0 ? (
              <span className="text-[#D6F599] font-medium text-xs">{spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left</span>
            ) : (
              <span className="text-[#C84C09] font-medium text-xs">Full</span>
            )}
          </div>
        </div>

        <div className="px-5 pb-5">
          {memberOfRoom ? (
            <button
              onClick={() => handleEnterRoom(room._id)}
              className="w-full py-2.5 bg-[#436436]/40 hover:bg-[#436436]/60 text-[#D6F599] border border-[#436436]/50 font-semibold rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm text-sm"
            >
              Enter Room →
            </button>
          ) : spotsLeft > 0 ? (
            <button
              onClick={() => handleJoin(room._id)}
              className="w-full py-2.5 bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#D2FF28]/20 text-[#420217] font-bold rounded-xl transition-all duration-300 cursor-pointer text-sm"
            >
              Join Room
            </button>
          ) : (
            <button disabled className="w-full py-2.5 bg-white/5 text-white/25 font-semibold rounded-xl cursor-not-allowed border border-white/8 text-sm">
              Room Full
            </button>
          )}
        </div>
      </div>
    );
  };

  const displayRooms = activeTab === 'my-rooms' ? myActiveRooms : rooms;

  return (
    <AnimatedBackground>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-[#D2FF28]">{user?.fullName?.firstName}</span>! 👋
            </h1>
            <p className="text-white/50 mt-1">Manage your rooms or discover new ones</p>
          </div>
          <Link
            to="/rooms"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-105 hover:shadow-xl hover:shadow-[#D2FF28]/25 text-[#420217] font-bold rounded-xl transition-all duration-300 shadow-lg text-center text-sm"
          >
            <Plus size={18} />
            Create New Room
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/8 backdrop-blur-lg rounded-2xl p-5 border border-white/15">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">My Rooms</p>
            <p className="text-3xl font-bold text-[#D6F599]">{myActiveRooms?.length || 0}</p>
          </div>
          <div className="bg-white/8 backdrop-blur-lg rounded-2xl p-5 border border-white/15">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Active Rooms</p>
            <p className="text-3xl font-bold text-[#D2FF28]">{rooms?.length || 0}</p>
          </div>
          <div className="bg-white/8 backdrop-blur-lg rounded-2xl p-5 border border-white/15 hidden md:block">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Status</p>
            <p className="text-[#D6F599] font-semibold flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-[#D2FF28] rounded-full animate-pulse shadow-[0_0_8px_#D2FF28]" />
              Online
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('my-rooms')}
            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'my-rooms'
                ? 'bg-[#436436]/60 text-[#D2FF28] shadow-lg backdrop-blur-md border border-[#D6F599]/40'
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-sm'
            }`}
          >
            My Rooms
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-[#436436]/60 text-[#D2FF28] shadow-lg backdrop-blur-md border border-[#D6F599]/40'
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-sm'
            }`}
          >
            Browse All Rooms
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D2FF28]" />
          </div>
        ) : displayRooms.length === 0 ? (
          <div className="bg-white/8 backdrop-blur-lg rounded-3xl shadow-lg p-12 text-center border border-white/15">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
              <Search size={24} className="text-white/40" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No rooms found</h2>
            <p className="text-white/50">
              {activeTab === 'my-rooms'
                ? "You haven't joined any rooms yet. Switch to 'Browse All Rooms' to find one!"
                : 'No active rooms available. Be the first to create one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRooms.map((room, index) => {
              const isMember = room.members?.some(
                (m) => m === user?.id || m._id === user?.id
              );
              return renderRoomCard(room, isMember, index);
            })}
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default Dashboard;
