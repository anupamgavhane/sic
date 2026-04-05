import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import useAuth from '../hooks/useAuth';
import { fetchRooms, createRoom, joinRoom } from '../features/rooms/roomThunks';
import { clearRoomError } from '../features/rooms/roomSlice';
import { Car, UtensilsCrossed, ShoppingCart, Salad, Package, Plus, Search, Clock, Users, X } from 'lucide-react';

const CATEGORIES = ['ride', 'food', 'ecommerce', 'grocery', 'other'];

const CATEGORY_STYLES = {
  ride: { bg: 'bg-[#436436]/50', text: 'text-[#D6F599]', border: 'border-[#436436]/30', Icon: Car },
  food: { bg: 'bg-[#C84C09]/30', text: 'text-white', border: 'border-[#C84C09]/30', Icon: UtensilsCrossed },
  ecommerce: { bg: 'bg-[#420217]/50', text: 'text-[#D2FF28]', border: 'border-[#420217]/30', Icon: ShoppingCart },
  grocery: { bg: 'bg-[#D6F599]/20', text: 'text-[#D6F599]', border: 'border-[#D6F599]/30', Icon: Salad },
  other: { bg: 'bg-white/10', text: 'text-white/80', border: 'border-white/20', Icon: Package },
};

const Rooms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rooms, loading, error } = useSelector((state) => state.rooms);

  const [activeFilter, setActiveFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'other',
    maxMembers: 4,
    expiryTime: '',
  });
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    dispatch(fetchRooms(activeFilter || undefined));
  }, [dispatch, activeFilter]);

  const handleFilterClick = (cat) => {
    setActiveFilter(activeFilter === cat ? '' : cat);
  };

  const handleJoin = async (roomId) => {
    const result = await dispatch(joinRoom(roomId));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/chat/${roomId}`);
    }
  };

  const handleEnterRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateError('');
    dispatch(clearRoomError());

    if (!createForm.title.trim()) {
      setCreateError('Title is required');
      return;
    }
    if (!createForm.expiryTime) {
      setCreateError('Expiry time is required');
      return;
    }

    const result = await dispatch(createRoom(createForm));
    if (result.meta.requestStatus === 'fulfilled') {
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        description: '',
        category: 'other',
        maxMembers: 4,
        expiryTime: '',
      });
      dispatch(fetchRooms(activeFilter || undefined));
    } else {
      setCreateError(result.payload?.message || 'Failed to create room');
    }
  };

  const isMember = (room) => {
    return room.members?.some((m) => {
      const memberId = typeof m === 'string' ? m : m._id;
      return memberId === user?.id;
    });
  };

  const getTimeRemaining = (expiryTime) => {
    const diff = new Date(expiryTime) - new Date();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <AnimatedBackground>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Chat Rooms</h1>
            <p className="text-[#D6F599]/80 mt-1">Browse and join active rooms</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-2.5 bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-105 hover:shadow-xl hover:shadow-[#D2FF28]/25 text-[#420217] font-bold rounded-xl transition-all duration-300 shadow-lg cursor-pointer text-sm"
          >
            <Plus size={18} />
            Create Room
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveFilter('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeFilter === ''
                ? 'bg-[#436436]/60 text-[#D2FF28] shadow-lg backdrop-blur-md border border-[#D6F599]/40'
                : 'bg-white/8 text-white/70 border border-white/10 hover:bg-white/15 hover:text-white backdrop-blur-sm'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const catStyle = CATEGORY_STYLES[cat];
            const CatIcon = catStyle.Icon;
            return (
              <button
                key={cat}
                onClick={() => handleFilterClick(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#436436]/60 text-[#D2FF28] shadow-lg backdrop-blur-md border border-[#D6F599]/40'
                    : 'bg-white/8 text-white/70 border border-white/10 hover:bg-white/15 hover:text-white backdrop-blur-sm'
                }`}
              >
                <CatIcon size={14} />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-[#C84C09]/20 backdrop-blur-md border border-[#C84C09]/40 rounded-xl">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D2FF28]" />
          </div>
        )}

        {/* Empty State */}
        {!loading && rooms.length === 0 && (
          <div className="bg-white/8 backdrop-blur-lg rounded-3xl shadow-lg p-12 text-center border border-white/15">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
              <Search size={24} className="text-white/40" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No rooms found</h2>
            <p className="text-white/50 mb-6">
              {activeFilter
                ? `No active rooms in the "${activeFilter}" category.`
                : 'No active rooms available. Be the first to create one!'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 mx-auto px-6 py-2.5 bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-105 hover:shadow-xl text-[#420217] font-bold rounded-xl transition-all duration-300 cursor-pointer"
            >
              <Plus size={18} />
              Create a Room
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => {
              const catStyle = CATEGORY_STYLES[room.category] || CATEGORY_STYLES.other;
              const CatIcon = catStyle.Icon;
              const memberOfRoom = isMember(room);
              const spotsLeft = room.maxMembers - (room.members?.length || 0);

              return (
                <div
                  key={room._id}
                  className="card-enter bg-white/8 backdrop-blur-lg rounded-2xl shadow-lg border border-white/15 hover:scale-[1.03] hover:shadow-2xl hover:bg-white/12 hover:border-[#D6F599]/30 transition-all duration-300 overflow-hidden flex flex-col"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="p-5 flex-1">
                    {/* Category Badge + Time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border} backdrop-blur-sm`}>
                        <CatIcon size={12} />
                        {room.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/50 bg-black/20 px-2 py-0.5 rounded-md">
                        <Clock size={11} />
                        {getTimeRemaining(room.expiryTime)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{room.title}</h3>

                    {/* Description */}
                    {room.description && (
                      <p className="text-sm text-white/50 mb-3 line-clamp-2">{room.description}</p>
                    )}

                    {/* Members Bar */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-white/60">
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

                  {/* Action Button */}
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
                      <button
                        disabled
                        className="w-full py-2.5 bg-white/5 text-white/25 font-semibold rounded-xl cursor-not-allowed border border-white/8 text-sm"
                      >
                        Room Full
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#420217]/50 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#D6F599]/20 page-enter">
            <div className="px-6 py-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Create New Room</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/40 hover:text-[#C84C09] hover:bg-white/10 p-1.5 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateRoom} className="px-6 py-5 space-y-4">
              {createError && (
                <div className="p-3 bg-[#C84C09]/20 border border-[#C84C09]/40 rounded-xl">
                  <p className="text-white text-sm">{createError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Title *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F599]/50 transition-all duration-300 text-white placeholder-white/20 backdrop-blur-sm"
                  placeholder="e.g., Uber Pool to Airport"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F599]/50 transition-all duration-300 resize-none text-white placeholder-white/20 backdrop-blur-sm"
                  rows="2"
                  placeholder="Brief description of the room..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Category *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F599]/50 transition-all duration-300 text-white backdrop-blur-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#436436] text-[#D6F599]">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Max Members *</label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={createForm.maxMembers}
                    onChange={(e) => setCreateForm({ ...createForm, maxMembers: parseInt(e.target.value) || 2 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F599]/50 transition-all duration-300 text-white backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Expiry Time *</label>
                <input
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={createForm.expiryTime}
                  onChange={(e) => setCreateForm({ ...createForm, expiryTime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F599]/50 transition-all duration-300 text-white backdrop-blur-sm [color-scheme:dark]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-white/15 text-white/70 font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#D2FF28]/25 disabled:opacity-40 text-[#420217] font-bold rounded-xl transition-all duration-300 cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatedBackground>
  );
};

export default Rooms;
