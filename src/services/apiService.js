import axios from 'axios';

class ApiService {
  // Base URL for the backend API
  static baseUrl = 'http://localhost:3000/api';
  
  // Token storage key
  static tokenKey = 'auth_token';

  // Axios instance with default config
  static api = axios.create({
    baseURL: ApiService.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Method to set auth token in headers
  static async setAuthToken(token) {
    localStorage.setItem(ApiService.tokenKey, token);
    ApiService.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to get auth token from storage
  static getAuthToken() {
    return localStorage.getItem(ApiService.tokenKey);
  }

  // Method to clear auth token
  static clearAuthToken() {
    localStorage.removeItem(ApiService.tokenKey);
    delete ApiService.api.defaults.headers.common['Authorization'];
  }

  // Initialize auth token from storage
  static initializeAuth() {
    const token = ApiService.getAuthToken();
    if (token) {
      ApiService.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Method to check if user is authenticated
  static isAuthenticated() {
    const token = ApiService.getAuthToken();
    return !!token;
  }

  // Login method
  static async login(phone, password) {
    try {
      const response = await ApiService.api.post('/auth/login', {
        phone,
        password,
      });

      if (response.data.token) {
        await ApiService.setAuthToken(response.data.token);
      }
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  // Register method
  static async register(name, phone, email, password) {
    try {
      const response = await ApiService.api.post('/auth/register', {
        name,
        phone,
        email,
        password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  // Logout method
  static async logout() {
    try {
      await ApiService.api.post('/auth/logout');
      ApiService.clearAuthToken();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  }

  // Get user profile
  static async getProfile() {
    try {
      const response = await ApiService.api.get('/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load profile',
      };
    }
  }

  // Update profile
  static async updateProfile(name, email) {
    try {
      const response = await ApiService.api.patch('/profile', {
        name,
        email,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  }

  // Change password
  static async changePassword(oldPassword, newPassword) {
    try {
      const response = await ApiService.api.patch('/change-password', {
        oldPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
      };
    }
  }

  // Get friends list
  static async getFriends() {
    try {
      const response = await ApiService.api.get('/friends');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load friends',
      };
    }
  }

  // Add friend by phone number
  static async addFriend(friendPhone) {
    try {
      const response = await ApiService.api.post('/friends', {
        friendPhone,
      });

      return {
        success: true,
        message: response.data.message || 'Friend added successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add friend',
      };
    }
  }

  // Get friend requests
  static async getFriendRequests() {
    try {
      const response = await ApiService.api.get('/friends/requests');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load friend requests',
      };
    }
  }

  // Respond to friend request (accept/reject)
  static async respondToFriendRequest(requestId, action) {
    try {
      const response = await ApiService.api.patch(`/friends/respond/${requestId}`, {
        action,
      });

      return {
        success: true,
        message: response.data.message || 'Friend request processed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process friend request',
      };
    }
  }

  // Delete friend
  static async deleteFriend(friendPhone) {
    try {
      const response = await ApiService.api.delete(`/friends/${friendPhone}`);
      return {
        success: true,
        message: response.data.message || 'Friend removed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove friend',
      };
    }
  }

  // Search user by phone
  static async searchUser(phone) {
    try {
      const response = await ApiService.api.get(`/users/search?phone=${phone}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search user',
      };
    }
  }

  // Transfer money
  static async transferMoney(receiverPhone, amount, type, message = null) {
    try {
      const payload = {
        receiverPhone,
        amount,
        type,
      };

      if (message) {
        payload.message = message;
      }

      const response = await ApiService.api.post('/transfer', payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to transfer money',
      };
    }
  }

  // Get messages with a friend
  static async getMessages(friendPhone) {
    try {
      const response = await ApiService.api.get(`/messages/${friendPhone}`);
      return {
        success: true,
        messages: response.data.messages,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load messages',
      };
    }
  }

  // Send message
  static async sendMessage(receiverPhone, message) {
    try {
      const response = await ApiService.api.post('/messages', {
        receiverPhone,
        message,
      });

      return {
        success: true,
        message: response.data.message || 'Message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message',
      };
    }
  }

  // Get income records
  static async getIncomeRecords() {
    try {
      const response = await ApiService.api.get('/income-record');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load income records',
      };
    }
  }

  // Get expense records
  static async getExpenseRecords() {
    try {
      const response = await ApiService.api.get('/expense-record');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load expense records',
      };
    }
  }

  // Get recent transactions
  static async getRecentTransactions() {
    try {
      const response = await ApiService.api.get('/recent-transactions');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load recent transactions',
      };
    }
  }

  // Get transaction history
  static async getTransactionHistory() {
    try {
      const response = await ApiService.api.get('/transaction-history');
      return {
        success: true,
        message: response.data.message,
        records: response.data.records,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load transaction history',
      };
    }
  }

  // Get bills
  static async getBills() {
    try {
      const response = await ApiService.api.get('/bills');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load bills',
      };
    }
  }

  // Add new bill
  static async addBill(name, amount, dueDate, category) {
    try {
      const response = await ApiService.api.post('/bills', {
        name,
        amount,
        dueDate,
        category
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add bill',
      };
    }
  }
  
  // Update bill
  static async updateBill(billId, name, amount, dueDate, category) {
    try {
      const response = await ApiService.api.put(`/bills/${billId}`, {
        name,
        amount,
        dueDate,
        category
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update bill',
      };
    }
  }
  
  // Delete bill
  static async deleteBill(billId) {
    try {
      const response = await ApiService.api.delete(`/bills/${billId}`);
      
      return {
        success: true,
        message: response.data.message || 'Bill deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete bill',
      };
    }
  }

  // Send message to chatbot
  static async sendChatbotMessage(message) {
    try {
      const response = await ApiService.api.post('/chatbot', {
        message,
      });

      return {
        success: true,
        response: response.data.response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get chatbot response',
      };
    }
  }
}

// Initialize authentication on load
ApiService.initializeAuth();

export default ApiService;