import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../../services/apiService.js';
import { User, Search, Plus, Bell, X, Phone, Check, UserX, ArrowLeftIcon } from 'lucide-react';
import ChatRoom from './ChatRoom';

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
  // Tambahkan state untuk permintaan pertemanan
  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestActionLoading, setRequestActionLoading] = useState(false);
  const [requestActionSuccess, setRequestActionSuccess] = useState('');
  const [requestActionError, setRequestActionError] = useState('');

  // Fetch friends list
  useEffect(() => {
    fetchFriends();
    fetchFriendRequests(); // Tambahkan fetch friend requests

    // Initialize Socket.IO connection
    ws.current = ApiService.createWebSocketConnection();

    // Handle friend requests
    ws.current.on('friend_request', (data) => {
      console.log('Friend request received:', data);
      fetchFriendRequests();
      showNotification('New Friend Request', `${data.name} sent you a friend request`);
    });

    // Handle accepted friend requests
    ws.current.on('friend_request_accepted', (data) => {
      console.log('Friend request accepted:', data);
      fetchFriends();
      showNotification('Friend Request Accepted', `${data.name} accepted your friend request`);
    });

    // Handle rejected friend requests
    ws.current.on('friend_request_rejected', (data) => {
      console.log('Friend request rejected:', data);
      showNotification('Friend Request Rejected', `${data.name} rejected your friend request`);
    });

    return () => {
      if (ws.current) {
        ws.current.disconnect();
      }
    };
  }, []);

  // Function to show browser notification
  const showNotification = (title, body) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    }
  };

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getFriends();
      if (response.success) {
        setFriends(response.data.friends || []);
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
    if (!phoneNumber.trim()) {
      setAddFriendError('Please enter a phone number');
      return;
    }

    try {
      setAddFriendError('');
      setAddFriendSuccess('');

      // First search if user exists
      const searchResponse = await ApiService.searchUser(phoneNumber);

      if (!searchResponse.success) {
        setAddFriendError('User not found. Please check the phone number.');
        return;
      }

      // If user exists, send friend request
      const response = await ApiService.addFriend(phoneNumber);

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
    } catch (err) {
      setAddFriendError('An unexpected error occurred');
      console.error('Add friend error:', err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await ApiService.getFriendRequests();
      if (response.success) {
        setFriendRequests(response.data || []);
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

      const response = await ApiService.respondToFriendRequest(requestId, action);

      if (response.success) {
        setRequestActionSuccess(response.message || `Friend request ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);

        // Emit event melalui WebSocket untuk memberitahu pengirim permintaan
        if (ws.current) {
          ws.current.emit('friend_request_response', {
            requestId,
            action,
            friendId: response.data?.friendId, // Pastikan backend mengirimkan friendId
          });
        }

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {selectedFriend ? (
                <>
                  <h1 className="text-xl font-semibold text-gray-800">Chat</h1>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="mr-2 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                  </Link>
                  <h1 className="text-xl font-semibold text-gray-800">Friends</h1>
                </>
              )}
            </div>
            {!selectedFriend && (
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
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Friend Requests Dropdown */}
        {showFriendRequests && !selectedFriend && (
          <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
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

        {/* Existing content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchFriends} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : selectedFriend ? (
          // Render ChatRoom component
          <ChatRoom friend={selectedFriend} onBack={() => setSelectedFriend(null)} ws={ws} />
        ) : friends.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-indigo-100 p-6 rounded-full mb-6">
              <User className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Friends Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md">Add friends to chat with them and send money easily. Start by adding your first friend!</p>
            <button onClick={() => setShowAddFriendModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Friend
            </button>
          </div>
        ) : (
          // Friends List
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search friends..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {friends.map((friend) => (
                <div key={friend.id} onClick={() => setSelectedFriend(friend)} className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
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
