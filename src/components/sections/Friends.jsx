import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../../services/apiService.js';
import { User, Search, Plus, Bell, X, Phone, Check, ArrowLeftIcon } from 'lucide-react';
import ChatRoom from './ChatRoom.jsx';
import FriendController from '../../controllers/FriendController.js';

export const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addFriendError, setAddFriendError] = useState('');
  const [addFriendSuccess, setAddFriendSuccess] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const ws = useRef(null);
  // State untuk permintaan pertemanan
  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestActionLoading, setRequestActionLoading] = useState(false);
  const [requestActionSuccess, setRequestActionSuccess] = useState('');
  const [requestActionError, setRequestActionError] = useState('');

  // Fetch friends list
  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();

    // Initialize Socket.IO connection
    ws.current = ApiService.createWebSocketConnection();

    // Handle friend requests
    ws.current.on('friend_request', (data) => {
      fetchFriendRequests();
      FriendController.showNotification('New Friend Request', `${data.name} sent you a friend request`);
    });

    // Handle accepted friend requests
    ws.current.on('friend_request_accepted', (data) => {
      fetchFriends();
      FriendController.showNotification('Friend Request Accepted', `${data.name} accepted your friend request`);
    });

    return () => {
      if (ws.current) {
        ws.current.disconnect();
      }
    };
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await FriendController.getFriends();
      if (response.success) {
        setFriends(response.friends || []);
      } else {
        setError(response.message || 'Failed to load friends');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Friends fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    const response = await FriendController.addFriend(phoneNumber);

    if (response.success) {
      setAddFriendSuccess(response.message || 'Friend request sent successfully');
      setPhoneNumber('');
      fetchFriends(); // Refresh friends list
      setTimeout(() => {
        setShowAddFriendModal(false);
        setAddFriendSuccess('');
      }, 2000);
    } else {
      setAddFriendError(response.message || 'Failed to add friend');
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await FriendController.getFriendRequests();
      if (response.success) {
        setFriendRequests(response.requests || []);
      } else {
        console.error('Failed to load friend requests:', response.message);
      }
    } catch (err) {
      console.error('Friend requests fetch error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleFriendRequestAction = async (requestId, action) => {
    try {
      setRequestActionLoading(true);
      setRequestActionError('');
      setRequestActionSuccess('');

      const response = await FriendController.respondToFriendRequest(requestId, action);

      if (response.success) {
        setRequestActionSuccess(response.message || `Friend request ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
        // Refresh friend requests and friends list
        fetchFriendRequests();
        if (action === 'accept') {
          fetchFriends();
        }
        // Clear success message after a delay
        setTimeout(() => {
          setRequestActionSuccess('');
        }, 3000);

        // Close friend requests dropdown after action
        if (friendRequests.length <= 1) {
          setTimeout(() => {
            setShowFriendRequests(false);
          }, 2000);
        }
      } else {
        setRequestActionError(response.message || `Failed to ${action} friend request`);
      }
    } catch (err) {
      setRequestActionError('An unexpected error occurred');
      console.error('Friend request action error:', err);
    } finally {
      setRequestActionLoading(false);
    }
  };

  // Render UI (tidak berubah dari kode asli)
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-2 p-2 rounded-full hover:bg-gray-100">
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-800">Chat</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Friend Request Button */}
              <button onClick={() => setShowFriendRequests(!showFriendRequests)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {friendRequests.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{friendRequests.length}</span>}
              </button>
              {/* Add Friend Button */}
              <button onClick={() => setShowAddFriendModal(true)} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - WhatsApp Style Layout */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-lg shadow overflow-hidden">
          {/* Left Side - Friends List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Friend Requests Dropdown */}
            {showFriendRequests && (
              <div className="bg-white border-b border-gray-200">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">Friend Requests</h2>
                </div>
                {loadingRequests ? (
                  <div className="flex justify-center items-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : friendRequests.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No pending friend requests</p>
                  </div>
                ) : (
                  <div>
                    {friendRequests.map((request) => (
                      <div key={request.id} className="p-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-gray-900">{request.name}</h3>
                              <p className="text-sm text-gray-500">{request.phone}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {requestActionLoading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                            ) : (
                              <>
                                <button onClick={() => handleFriendRequestAction(request.id, 'accept')} className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors flex items-center">
                                  <Check className="w-4 h-4 mr-1" />
                                  Accept
                                </button>
                                <button onClick={() => handleFriendRequestAction(request.id, 'reject')} className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors flex items-center">
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {requestActionSuccess && <p className="mt-2 text-sm text-green-600">{requestActionSuccess}</p>}
                        {requestActionError && <p className="mt-2 text-sm text-red-600">{requestActionError}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search friends..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {/* Friends List */}
            <div className="flex-grow overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">
                  <p>{error}</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No friends yet. Add some friends to start chatting!</p>
                </div>
              ) : (
                <div>
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedFriend && selectedFriend.id === friend.id ? 'bg-indigo-50' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{friend.name}</h3>
                          <p className="text-sm text-gray-500">{friend.phone}</p>
                        </div>
                        <div className="ml-auto">
                          <span className={`inline-block w-3 h-3 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Chat Room */}
          <div className="w-2/3">
            {selectedFriend ? (
              <ChatRoom friend={selectedFriend} onBack={() => setSelectedFriend(null)} ws={ws} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Select a friend to start chatting</h2>
                <p className="text-gray-500 max-w-md px-6">Choose a conversation from the left or add new friends to chat with.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add Friend</h2>
              <button
                onClick={() => {
                  setShowAddFriendModal(false);
                  setPhoneNumber('');
                  setAddFriendError('');
                  setAddFriendSuccess('');
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
                    setAddFriendError('');
                  }}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {addFriendError && <p className="mt-2 text-sm text-red-600">{addFriendError}</p>}
              {addFriendSuccess && <p className="mt-2 text-sm text-green-600">{addFriendSuccess}</p>}
            </div>

            <button onClick={handleAddFriend} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Add Friend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
