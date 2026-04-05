import React from 'react';
import { Link } from 'react-router-dom';

const PALS = [
  { bg: 'bg-[#436436]', text: 'text-[#D6F599]' }, // Hunter Green / Lime Cream
  { bg: 'bg-[#C84C09]', text: 'text-white' }, // Spicy Orange / White
  { bg: 'bg-[#420217]', text: 'text-[#D2FF28]' }, // Night Bordeaux / Chartreuse
  { bg: 'bg-indigo-500', text: 'text-white' },
  { bg: 'bg-teal-500', text: 'text-white' },
];

const getAvatarStyle = (name) => {
  if (!name) return PALS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALS.length;
  return PALS[index];
};

const MessageBubble = ({ message, isOwn, isConsecutive }) => {
  // Format the time
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const senderName = message.sender?.fullName?.firstName || 'Unknown';
  const initial = senderName.charAt(0).toUpperCase();
  const avatarStyle = getAvatarStyle(senderName);

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-0.5' : 'mt-4'} msg-enter`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar (only show on non-consecutive or last message of group if we had a full conversation view. For now, simple logic: hide avatar on consecutive messages to match typical chat apps) */}
        {!isOwn && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md shrink-0 ${isConsecutive ? 'opacity-0' : 'opacity-100'} ${avatarStyle.bg} ${avatarStyle.text}`}>
            {initial}
          </div>
        )}

        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} gap-1 min-w-[120px]`}>
          
          {/* Sender Name - only show if not own message and not consecutive */}
          {!isOwn && !isConsecutive && (
            <div className="px-2">
              <Link 
                to={`/profile/${message.sender?._id}`}
                className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
              >
                {message.sender?.fullName?.firstName} {message.sender?.fullName?.lastName}
              </Link>
            </div>
          )}

          {/* Bubble */}
          <div
            className={`
              relative px-4 py-2.5 shadow-sm
              ${isOwn 
                ? 'bg-[#C84C09] text-white rounded-2xl rounded-br-sm' 
                : 'bg-white/10 backdrop-blur-md text-white/95 border border-white/10 rounded-2xl rounded-bl-sm'}
            `}
          >
            <p className="text-[15px] leading-relaxed break-words">
              {message.text}
            </p>
            <span className={`text-[10px] mt-1 block text-right font-medium ${isOwn ? 'text-white/60' : 'text-white/40'}`}>
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;