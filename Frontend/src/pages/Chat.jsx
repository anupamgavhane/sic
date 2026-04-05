import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Users, Send, Info, MessageCircle, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { io } from 'socket.io-client';
import MessageBubble from '../components/MessageBubble';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { leaveRoom } from '../features/rooms/roomThunks';

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaveLoading, setLeaveLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchRoomAndMessages = async () => {
      try {
        setLoading(true);
        const roomRes = await api.get(`/rooms/${roomId}`);
        setRoomDetails(roomRes.data.room);

        const msgRes = await api.get(`/api/${roomId}/messages`);
        setMessages(msgRes.data.messages);
      } catch (err) {
        console.error('Failed to load chat', err);
        if (err.response?.status === 403 || err.response?.status === 404) {
          navigate('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAndMessages();

    // Socket.io connection using API base URL
    const newSocket = io(
      import.meta.env.MODE === 'production'
      ? window.location.origin
      : 'https://sic-v64w.onrender.com/',
      {
        withCredentials: true
      }
    );
    setSocket(newSocket);

    newSocket.emit('joinRoom', roomId);

    newSocket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !roomDetails) return;

    const messageData = {
      roomId,
      sender: user.id,
      text: newMessage,
    };

    // Optimistic UI update
    const tempMsg = {
      _id: Date.now().toString(),
      sender: {
        _id: user.id,
        fullName: user.fullName,
      },
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage('');

    try {
      socket.emit('sendMessage', messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message if failed
      setMessages((prev) => prev.filter(m => m._id !== tempMsg._id));
    }
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

  if (loading) {
    return (
      <AnimatedBackground className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2FF28]" />
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col h-[calc(100vh-64px)] page-enter">
        {/* Chat Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-t-3xl border border-white/15 p-4 sm:p-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 group cursor-pointer"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white leading-none">{roomDetails?.title}</h2>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#436436]/50 text-[#D6F599] border border-[#436436]/50 backdrop-blur-sm">
                  {roomDetails?.category}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm text-white/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D2FF28] shadow-[0_0_8px_#D2FF28] animate-pulse"></span>
                  Active now
                </p>
                <span className="text-white/20 text-xs">•</span>
                <p className="text-sm text-white/50 flex items-center gap-1.5">
                  <Users size={14} />
                  {roomDetails?.members?.length || 0} / {roomDetails?.maxMembers} members
                </p>
              </div>
            </div>
          </div>

          {/* Info Button Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => navigate(`/room/${roomId}`)}
              className="flex items-center justify-center p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
              title="View room details"
            >
              <Info size={20} />
            </button>
            <button
              onClick={handleLeaveRoom}
              disabled={leaveLoading}
              className="flex items-center justify-center p-2.5 rounded-xl text-white/50 hover:text-[#C84C09] hover:bg-[#C84C09]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Leave room"
            >
              {leaveLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogOut size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 bg-black/20 backdrop-blur-md border-x border-white/15 overflow-y-auto p-4 sm:p-6 glass-scrollbar flex flex-col gap-1.5 shadow-inner">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-4 backdrop-blur-sm">
                <MessageCircle size={24} className="text-white/30" />
              </div>
              <p className="text-white/60 font-medium text-lg">No messages yet</p>
              <p className="text-white/40 text-sm mt-1">Be the first to break the ice!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isOwn = msg.sender?._id === user?.id;
              const isConsecutive = idx > 0 && messages[idx - 1].sender?._id === msg.sender?._id;
              
              return (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwn={isOwn}
                  isConsecutive={isConsecutive}
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white/10 backdrop-blur-xl rounded-b-3xl border border-white/15 p-4 sm:p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSendMessage} className="flex gap-3 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#D6F599]/50 transition-all duration-300 text-white placeholder-white/30 backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3.5 bg-[#D2FF28] hover:bg-[#D6F599] disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 text-[#420217] font-bold rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg group cursor-pointer"
            >
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Chat;
