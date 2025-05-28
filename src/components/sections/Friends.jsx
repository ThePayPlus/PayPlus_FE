import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ApiService } from "../../services";
import { User, Search, Plus, Send, ArrowLeft, Phone, X } from "lucide-react";

export const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addFriendError, setAddFriendError] = useState("");
  const [addFriendSuccess, setAddFriendSuccess] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  // Fetch friends list
  useEffect(() => {
    fetchFriends();
    
    // Initialize WebSocket connection
    ws.current = new WebSocket('ws://localhost:3000');
    
    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message' && selectedFriend && 
          (data.sender === selectedFriend.phone || data.receiver === selectedFriend.phone)) {
        setMessages(prev => [...prev, data]);
      }
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when selected friend changes
  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.phone);
    }
  }, [selectedFriend]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getFriends();
      if (response.success) {
        setFriends(response.data.friends || []);
      } else {
        setError(response.message || "Failed to load friends");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Friends fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (friendPhone) => {
    try {
      setLoadingMessages(true);
      const response = await ApiService.getMessages(friendPhone);
      if (response.success) {
        setMessages(response.messages || []);
      } else {
        console.error("Failed to load messages:", response.message);
      }
    } catch (err) {
      console.error("Messages fetch error:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleAddFriend = async () => {
    if (!phoneNumber.trim()) {
      setAddFriendError("Please enter a phone number");
      return;
    }

    try {
      setAddFriendError("");
      setAddFriendSuccess("");
      
      // First search if user exists
      const searchResponse = await ApiService.searchUser(phoneNumber);
      
      if (!searchResponse.success) {
        setAddFriendError("User not found. Please check the phone number.");
        return;
      }
      
      // If user exists, send friend request
      const response = await ApiService.addFriend(phoneNumber);
      
      if (response.success) {
        setAddFriendSuccess(response.message || "Friend request sent successfully");
        setPhoneNumber("");
        fetchFriends(); // Refresh friends list
        setTimeout(() => {
          setShowAddFriendModal(false);
          setAddFriendSuccess("");
        }, 2000);
      } else {
        setAddFriendError(response.message || "Failed to add friend");
      }
    } catch (err) {
      setAddFriendError("An unexpected error occurred");
      console.error("Add friend error:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const messageData = {
        type: 'message',
        sender: null, // Will be set by the server based on the auth token
        receiver: selectedFriend.phone,
        message: newMessage,
        sent_at: new Date().toISOString()
      };
      
      // Send via WebSocket
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(messageData));
      }
      
      // Also send via API for persistence
      const response = await ApiService.sendMessage(selectedFriend.phone, newMessage);
      
      if (response.success) {
        // Add message to local state
        const userProfile = await ApiService.getProfile();
        const newMsg = {
          sender: userProfile.data.phone,
          receiver: selectedFriend.phone,
          message: newMessage,
          sent_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage("");
      } else {
        console.error("Failed to send message:", response.message);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {selectedFriend ? (
                <button 
                  onClick={() => setSelectedFriend(null)}
                  className="mr-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              ) : (
                <Link to="/dashboard" className="mr-2 p-2 rounded-full hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
              )}
              <h1 className="text-xl font-semibold text-gray-800">
                {selectedFriend ? selectedFriend.name : "Friends"}
              </h1>
            </div>
            {!selectedFriend && (
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchFriends}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : selectedFriend ? (
          // Chat Room
          <div className="flex flex-col h-[calc(100vh-12rem)]">
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
                    const isSentByMe = msg.sender === null || msg.sender !== selectedFriend.phone;
                    return (
                      <div
                        key={index}
                        className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            isSentByMe
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p className={`text-xs mt-1 ${isSentByMe ? 'text-indigo-200' : 'text-gray-500'}`}>
                            {formatTime(msg.sent_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white p-3 rounded-lg shadow flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : friends.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-indigo-100 p-6 rounded-full mb-6">
              <User className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Friends Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Add friends to chat with them and send money easily. Start by adding your first friend!
            </p>
            <button
              onClick={() => setShowAddFriendModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Friend
            </button>
          </div>
        ) : (
          // Friends List
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium text-gray-900">{friend.name}</h3>
                    <p className="text-sm text-gray-500">{friend.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add Friend</h2>
              <button
                onClick={() => {
                  setShowAddFriendModal(false);
                  setPhoneNumber("");
                  setAddFriendError("");
                  setAddFriendSuccess("");
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Friend's Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setAddFriendError("");
                  }}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {addFriendError && <p className="mt-2 text-sm text-red-600">{addFriendError}</p>}
              {addFriendSuccess && <p className="mt-2 text-sm text-green-600">{addFriendSuccess}</p>}
            </div>

            <button
              onClick={handleAddFriend}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Friend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};