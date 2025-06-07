import axios from 'axios';
import { io } from 'socket.io-client';

class ApiService {
  // Base URL for the backend API
  static baseUrl = 'http://localhost:3000/api';
  static wsUrl = 'wss://78nvh33s-3000.asse.devtunnels.ms';
  // Token storage key
  static tokenKey = 'auth_token';

  // Axios instance with default config
  static api = axios.create({
    baseURL: ApiService.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Socket.IO helper methods
  static createWebSocketConnection() {
    const token = ApiService.getAuthToken();
    const socket = io(ApiService.wsUrl, {
      query: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket.IO connection established with ID:', socket.id);
      // Kirim status online saat terhubung
      socket.emit('user_status', { status: 'online' });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      // Kirim status offline saat terputus jika memungkinkan
      if (socket.connected) {
        socket.emit('user_status', { status: 'offline' });
      }
    });

    // Tambahkan event untuk window sebelum unload untuk mengirim status offline
    window.addEventListener('beforeunload', () => {
      if (socket.connected) {
        socket.emit('user_status', { status: 'offline' });
      }
    });

    return socket;
  }

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
        // Simpan nomor telepon pengguna untuk identifikasi di chat
        localStorage.setItem('user_phone', phone);
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

  // ===== BAGIAN SAVINGS =====
  // Method untuk mengambil daftar tabungan pengguna dari server
  // Return: Object dengan property success (boolean) dan data (array tabungan) atau message (string error)
  static async getSavings() {
    try {
      // Melakukan request GET ke endpoint /savings untuk mendapatkan daftar tabungan
      const response = await ApiService.api.get('/savings');
      // Mengembalikan response sukses dengan data tabungan
      return {
        success: true,          // Indikator bahwa request berhasil
        data: response.data,    // Data tabungan dari server
      };
    } catch (error) {
      // Menangani error jika request gagal
      return {
        success: false,         // Indikator bahwa request gagal
        // Mengambil pesan error dari response server atau menggunakan pesan default
        message: error.response?.data?.message || 'Failed to load savings',
      };
    }
  }

  // Method untuk menambahkan tabungan baru
  // Parameter: 
  //   - nama: String nama tabungan
  //   - deskripsi: String deskripsi tabungan
  //   - target: Number jumlah target tabungan (akan dikonversi ke integer)
  // Return: Object dengan property success, data, dan message
  static async addSavings(nama, deskripsi, target) {
    try {
      // Melakukan request POST ke endpoint /savings dengan data tabungan baru
      const response = await ApiService.api.post('/savings', {
        nama,                   // Nama tabungan
        deskripsi,              // Deskripsi tabungan
        target: parseInt(target), // Mengkonversi target ke integer untuk memastikan format yang benar
      });

      // Mengembalikan response sukses dengan data dan pesan
      return {
        success: true,          // Indikator bahwa request berhasil
        data: response.data,    // Data tabungan yang berhasil ditambahkan
        message: response.data.message || 'Savings added successfully', // Pesan sukses
      };
    } catch (error) {
      // Menangani error jika request gagal
      return {
        success: false,         // Indikator bahwa request gagal
        // Mengambil pesan error dari response server atau menggunakan pesan default
        message: error.response?.data?.message || 'Failed to add savings',
      };
    }
  }

  // Method untuk menambahkan jumlah uang ke tabungan yang sudah ada
  // Parameter:
  //   - savingsId: String ID tabungan yang akan ditambah
  //   - amount: Number jumlah yang akan ditambahkan (akan dikonversi ke integer)
  // Return: Object dengan property success, data, dan message
  static async addToSavings(savingsId, amount) {
    try {
      // Melakukan request PATCH ke endpoint /savings/{id}/add dengan jumlah yang akan ditambahkan
      const response = await ApiService.api.patch(`/savings/${savingsId}/add`, {
        amount: parseInt(amount),  // Mengkonversi amount ke integer
        deductFromBalance: true,   // Flag untuk mengurangi saldo utama pengguna
      });
      // Mengembalikan response sukses dengan data dan pesan
      return {
        success: true,             // Indikator bahwa request berhasil
        data: response.data,       // Data hasil penambahan ke tabungan
        message: response.data.message || 'Amount added to savings successfully', // Pesan sukses
      };
    } catch (error) {
      // Menangani error jika request gagal
      return {
        success: false,            // Indikator bahwa request gagal
        // Mengambil pesan error dari response server atau menggunakan pesan default
        message: error.response?.data?.message || 'Failed to add amount to savings',
      };
    }
  }

  // Method untuk menghapus tabungan
  // Parameter: savingsId - String ID tabungan yang akan dihapus
  // Return: Object dengan property success dan message
  static async deleteSavings(savingsId) {
    try {
      // Melakukan request DELETE ke endpoint /savings/{id} untuk menghapus tabungan
      const response = await ApiService.api.delete(`/savings/${savingsId}`);
      // Mengembalikan response sukses dengan pesan
      return {
        success: true,             // Indikator bahwa request berhasil
        message: response.data.message || 'Savings deleted successfully', // Pesan sukses
      };
    } catch (error) {
      // Menangani error jika request gagal
      return {
        success: false,            // Indikator bahwa request gagal
        // Mengambil pesan error dari response server atau menggunakan pesan default
        message: error.response?.data?.message || 'Failed to delete savings',
      };
    }
  }

  // Method untuk memperbarui target tabungan
  // Parameter:
  //   - savingsId: String ID tabungan yang akan diperbarui
  //   - newTarget: Number target baru untuk tabungan (akan dikonversi ke integer)
  // Return: Object dengan property success dan message
  static async updateSavingsTarget(savingsId, newTarget) {
    try {
      // Validasi target tidak boleh 0 atau negatif
      const targetValue = parseInt(newTarget); // Mengkonversi newTarget ke integer
      if (targetValue <= 0) {
        // Jika target <= 0, kembalikan error tanpa melakukan request ke server
        return {
          success: false,
          message: 'Target tabungan tidak boleh 0 atau negatif',
        };
      }

      // Melakukan request PATCH ke endpoint /savings/{id}/update-target dengan target baru
      const response = await ApiService.api.patch(`/savings/${savingsId}/update-target`, {
        target: targetValue,      // Target baru yang sudah dikonversi ke integer
      });
      // Mengembalikan response sukses dengan pesan
      return {
        success: true,            // Indikator bahwa request berhasil
        message: response.data.message || 'Target tabungan berhasil diperbarui', // Pesan sukses
      };
    } catch (error) {
      // Menangani error jika request gagal
      return {
        success: false,           // Indikator bahwa request gagal
        // Mengambil pesan error dari response server atau menggunakan pesan default
        message: error.response?.data?.message || 'Gagal memperbarui target tabungan',
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

  // Send message (update untuk menggunakan Socket.IO)
  static async sendMessage(receiverPhone, message) {
    try {
      // Pesan tetap disimpan melalui API untuk persistensi
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
        category,
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
        category,
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

  // Top up balance
  static async topup(amount) {
    try {
      const response = await ApiService.api.post('/topup', {
        amount: parseInt(amount),
      });

      return {
        success: true,
        message: response.data.message || 'Top up successful',
        data: {
          amount: response.data.amount,
          newBalance: response.data.newBalance,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to top up',
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
export { ApiService };
