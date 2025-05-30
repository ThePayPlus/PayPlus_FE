import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User } from 'lucide-react';
import { ApiService } from '../../services/apiService.js';

const ChatRoom = ({ friend, onBack, ws }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch messages when component mounts
  useEffect(() => {
    if (friend) {
      fetchMessages(friend.phone);
    }

    // Handle incoming messages
    const handleMessage = (data) => {
      console.log('Message received:', data);
      if (friend && (data.sender === friend.phone || data.receiver === friend.phone)) {
        setMessages((prev) => [...prev, data]);
      }
    };

    // Handle typing indicators
    const handleTyping = (data) => {
      console.log('Typing indicator received:', data);
      if (friend && data.sender === friend.phone) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      console.log('Stop typing indicator received:', data);
      if (friend && data.sender === friend.phone) {
        setIsTyping(false);
      }
    };

    // Add event listeners
    if (ws.current) {
      ws.current.on('message', handleMessage);
      ws.current.on('typing', handleTyping);
      ws.current.on('stop-typing', handleStopTyping);

      // Emit a join-room event to ensure proper room connection
      ws.current.emit('join-chat', { friendPhone: friend.phone });
    }

    return () => {
      // Clean up event listeners when component unmounts
      if (ws.current) {
        ws.current.off('message', handleMessage);
        ws.current.off('typing', handleTyping);
        ws.current.off('stop-typing', handleStopTyping);
      }
    };
  }, [friend, ws]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (friendPhone) => {
    try {
      setLoadingMessages(true);
      const response = await ApiService.getMessages(friendPhone);
      if (response.success) {
        setMessages(response.messages || []);
      } else {
        console.error('Failed to load messages:', response.message);
      }
    } catch (err) {
      console.error('Messages fetch error:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !friend) return;

    try {
      const messageData = {
        receiver: friend.phone,
        message: newMessage,
      };

      console.log('Sending message:', messageData);

      // Send via Socket.IO
      ws.current.emit('message', messageData, (acknowledgement) => {
        console.log('Message acknowledgement:', acknowledgement);
      });

      // Add message to local state immediately for better UX
      const myPhone = localStorage.getItem('user_phone'); // Simpan phone number user saat login
      const newMsg = {
        sender: myPhone,
        receiver: friend.phone,
        message: newMessage,
        sent_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, newMsg]);

      // Clear input field
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleTypingIndicator = () => {
    if (!friend) return;

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Send typing event
    console.log('Sending typing indicator to:', friend.phone);
    ws.current.emit('typing', { receiver: friend.phone });

    // Set timeout to stop typing after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      console.log('Sending stop typing indicator to:', friend.phone);
      ws.current.emit('stop-typing', { receiver: friend.phone });
    }, 2000);

    setTypingTimeout(timeout);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center">
        <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{friend.name}</h3>
            <p className="text-xs text-gray-500">{friend.phone}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <User className="w-16 h-16 mb-4 text-gray-300" />
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => {
              // Periksa apakah pesan dikirim oleh pengguna saat ini atau oleh teman
              const isSentByMe = msg.sender !== friend.phone;
              return (
                <div key={index} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isSentByMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p>{msg.message}</p>
                    <p className={`text-xs mt-1 ${isSentByMe ? 'text-indigo-200' : 'text-gray-500'}`}>{formatTime(msg.sent_at)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white p-3 rounded-lg shadow flex flex-col">
        {isTyping && (
          <div className="text-xs text-gray-500 mb-1 ml-2 flex items-center">
            <div className="mr-2">{friend.name} sedang mengetik</div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTypingIndicator();
            }}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
