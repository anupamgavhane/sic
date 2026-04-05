import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Users, Trash2, Crown, Mail, Shield, MessageSquare, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { fetchRoom, removeMember, leaveRoom, deleteRoom } from '../features/rooms/roomThunks';

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { currentRoom: roomDetails, loading, error } = useSelector((state) => state.rooms);
  const [removing, setRemoving] = useState(null);
  const [removeSuccess, setRemoveSuccess] = useState('');
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRoom(roomId));
  }, [dispatch, roomId]);

  const isRoomCreator = roomDetails?.creator?._id === user?.id || roomDetails?.creator === user?.id;

  const handleRemoveMember = async (memberId) => {
    if (!isRoomCreator) return;

    setRemoving(memberId);
    const result = await dispatch(removeMember({ roomId, memberId }));

    if (result.meta.requestStatus === 'fulfilled') {
      setRemoveSuccess(`Member removed successfully!`);
      setTimeout(() => setRemoveSuccess(''), 3000);
    }

    setRemoving(null);
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm('Are you sure you want to leave this room?')) return;

    setLeaveLoading(true);
    const result = await dispatch(leaveRoom(roomId));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }

    setLeaveLoading(false);
  };

  const handleDeleteRoom = async () => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;

    setDeleteLoading(true);
    const result = await dispatch(deleteRoom(roomId));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }

    setDeleteLoading(false);
  };

  if (loading) {
    return (
      <AnimatedBackground className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2FF28]" />
      </AnimatedBackground>
    );
  }

  if (error || !roomDetails) {
    return (
      <AnimatedBackground>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#C84C09]/20 border border-[#C84C09]/30 rounded-2xl p-8 text-center backdrop-blur-sm">
            <p className="text-[#C84C09] font-medium">{error || 'Room not found'}</p>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  const members = roomDetails?.members || [];
  const creator = roomDetails?.creator;

  return (
    <AnimatedBackground className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{roomDetails.title}</h1>
            <p className="text-white/50 mt-1">Manage room members and view details</p>
          </div>
        </div>

        {/* Success Message */}
        {removeSuccess && (
          <div className="mb-6 p-4 bg-[#436436]/40 border border-[#436436]/50 rounded-xl backdrop-blur-sm">
            <p className="text-[#D6F599] text-center font-medium">{removeSuccess}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Info Card */}
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-[#D2FF28]" />
                Room Info
              </h2>

              {/* Category */}
              <div className="mb-4">
                <p className="text-white/50 text-sm mb-2">Category</p>
                <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#436436]/50 text-[#D6F599] border border-[#436436]/50">
                  {roomDetails.category}
                </span>
              </div>

              {/* Members */}
              <div className="mb-4">
                <p className="text-white/50 text-sm mb-2">Capacity</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D2FF28] to-[#D6F599]"
                      style={{
                        width: `${(members.length / roomDetails.maxMembers) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {members.length}/{roomDetails.maxMembers}
                  </span>
                </div>
              </div>

              {/* Description */}
              {roomDetails.description && (
                <div>
                  <p className="text-white/50 text-sm mb-2">Description</p>
                  <p className="text-white/70 text-sm leading-relaxed bg-white/5 rounded-lg p-3 border border-white/10">
                    {roomDetails.description}
                  </p>
                </div>
              )}
            </div>

            {/* Admin Features */}
            {isRoomCreator && (
              <div className="bg-[#D2FF28]/10 backdrop-blur-xl rounded-2xl border border-[#D2FF28]/20 p-6 shadow-lg">
                <h2 className="text-lg font-bold text-[#D2FF28] mb-3 flex items-center gap-2">
                  <Shield size={20} />
                  Admin Controls
                </h2>
                <p className="text-white/60 text-sm">
                  You have authority to remove members from this room.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Members */}
          <div className="lg:col-span-2">
            <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#D6F599]" />
                Members ({members.length})
              </h2>

              {members.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/50">No members in this room yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => {
                    const memberId = member?._id || member;
                    const memberName = member?.fullName
                      ? `${member.fullName.firstName} ${member.fullName.lastName}`
                      : 'Unknown';
                    const memberEmail = member?.email || 'No email';
                    const isCreator = creator?._id === memberId || creator === memberId;
                    const isSelf = user?.id === memberId;

                    return (
                      <div
                        key={memberId}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/8 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#C84C09] to-[#436436] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                            {memberName
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-semibold truncate">{memberName}</p>
                              {isCreator && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D2FF28]/20 border border-[#D2FF28]/50 text-[#D2FF28] text-xs font-bold">
                                  <Crown size={12} />
                                  Creator
                                </span>
                              )}
                              {isSelf && (
                                <span className="px-2 py-0.5 rounded-full bg-[#D6F599]/20 border border-[#D6F599]/50 text-[#D6F599] text-xs font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-white/50 text-xs flex items-center gap-1 truncate">
                              <Mail size={12} />
                              {memberEmail}
                            </p>
                          </div>
                        </div>

                        {isRoomCreator && !isCreator && !isSelf && (
                          <button
                            onClick={() => handleRemoveMember(memberId)}
                            disabled={removing === memberId}
                            className="ml-4 p-2.5 rounded-xl bg-[#C84C09]/20 hover:bg-[#C84C09]/40 border border-[#C84C09]/30 text-[#C84C09] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
                            title="Remove this member"
                          >
                            {removing === memberId ? (
                              <div className="w-5 h-5 border-2 border-[#C84C09]/30 border-t-[#C84C09] rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Creator Info */}
              {creator && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-white/50 text-sm mb-4">Room Creator</p>
                  <div className="p-4 bg-gradient-to-r from-[#D2FF28]/10 to-[#D6F599]/10 rounded-xl border border-white/15">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D2FF28] to-[#D6F599] rounded-full flex items-center justify-center text-[#420217] font-bold shadow-lg">
                        {`${creator?.fullName?.firstName?.[0] || ''}${creator?.fullName?.lastName?.[0] || ''}` || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {creator?.fullName
                            ? `${creator.fullName.firstName} ${creator.fullName.lastName}`
                            : 'Unknown'}
                        </p>
                        <p className="text-white/50 text-sm flex items-center gap-1">
                          <Mail size={12} />
                          {creator?.email || 'No email'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {/* Left buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/chat/${roomId}`)}
              className="flex items-center gap-2 px-6 py-3 bg-[#D2FF28] hover:bg-[#D6F599] hover:scale-105 text-[#420217] font-bold rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
            >
              <MessageSquare size={18} />
              Go to Chat
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>

          {/* Right buttons */}
          <div className="ml-auto flex gap-4">
            {/* Leave Room Button */}
            {!isRoomCreator && (
              <button
                onClick={handleLeaveRoom}
                disabled={leaveLoading}
                className="flex items-center gap-2 px-6 py-3 bg-[#C84C09]/20 hover:bg-[#C84C09]/40 border border-[#C84C09]/30 text-[#C84C09] font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {leaveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#C84C09]/30 border-t-[#C84C09] rounded-full animate-spin" />
                    Leaving...
                  </>
                ) : (
                  <>
                    <LogOut size={18} />
                    Leave Room
                  </>
                )}
              </button>
            )}

            {/* Delete Room Button - Only for Creator */}
            {isRoomCreator && (
              <button
                onClick={handleDeleteRoom}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-400 font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Room
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default RoomDetails;
