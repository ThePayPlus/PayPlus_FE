import ApiService from '../services/apiService';
import ChatbotMessage from '../models/ChatbotModel';

class ChatbotController {
  constructor() {
    this.chatHistory = [];
    this.isLoading = false;
  }

  /**
   * Mengirim pesan ke chatbot dan mendapatkan respons
   * @param {string} message - Pesan yang dikirim pengguna
   * @returns {Promise<ChatbotMessage>} - Objek pesan dengan respons dari chatbot
   */
  async sendMessage(message) {
    this.isLoading = true;

    try {
      // Buat objek pesan baru
      const newMessage = new ChatbotMessage(Date.now().toString(), message, '', new Date());

      // Tambahkan ke history dengan status loading
      newMessage.isLoading = true;
      this.chatHistory.push(newMessage);

      // Kirim pesan ke API
      const response = await ApiService.sendChatbotMessage(message);

      if (response.success) {
        // Update pesan dengan respons
        newMessage.response = response.response;
        newMessage.isLoading = false;
      } else {
        // Handle error
        newMessage.response = 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi nanti.';
        newMessage.isLoading = false;
      }

      return newMessage;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);

      // Buat pesan error
      const errorMessage = new ChatbotMessage(Date.now().toString(), message, 'Maaf, terjadi kesalahan saat berkomunikasi dengan server. Silakan coba lagi nanti.', new Date());

      this.chatHistory.push(errorMessage);
      return errorMessage;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Mendapatkan seluruh riwayat chat
   * @returns {Array<ChatbotMessage>} - Array berisi objek pesan
   */
  getChatHistory() {
    return this.chatHistory;
  }

  /**
   * Menghapus seluruh riwayat chat
   */
  clearChatHistory() {
    this.chatHistory = [];
  }
}

export default ChatbotController;
