import { ApiService } from '../services/apiService.js';
import { SavingsModel } from '../models/SavingsModel.js';

export class SavingsController {
  constructor() {
    this.savingsList = [];
    this.totalTarget = 0;
    this.totalCollected = 0;
    this.loading = true;
    this.error = '';
    this.alert = '';
    this.alertType = '';
    this.selectedSavings = null;
  }

  // Mengambil data savings dari API
  async fetchSavingsData() {
    try {
      this.loading = true;
      const response = await ApiService.getSavings();
      
      if (response.success) {
        // Ekstrak data dari berbagai kemungkinan struktur response
        let data = this._extractDataFromResponse(response);
        
        // Konversi data mentah ke model
        this.savingsList = data.map(item => new SavingsModel(item));
        this._calculateTotals();
        this.error = '';
        return {
          success: true,
          savingsList: this.savingsList,
          totalTarget: this.totalTarget,
          totalCollected: this.totalCollected
        };
      } else {
        this.error = response.message || 'Gagal memuat data savings';
        this.savingsList = [];
        return { success: false, error: this.error };
      }
    } catch (err) {
      this.error = 'Terjadi kesalahan saat memuat data';
      console.error('Fetch savings error:', err);
      this.savingsList = [];
      return { success: false, error: this.error };
    } finally {
      this.loading = false;
    }
  }

  // Ekstrak data dari berbagai kemungkinan struktur response
  _extractDataFromResponse(response) {
    let data = [];
    
    if (response.data) {
      // Jika response.data adalah array langsung
      if (Array.isArray(response.data)) {
        data = response.data;
      }
      // Jika response.data memiliki property 'savings'
      else if (response.data.savings && Array.isArray(response.data.savings)) {
        data = response.data.savings;
      }
      // Jika response.data memiliki property 'records'
      else if (response.data.records && Array.isArray(response.data.records)) {
        data = response.data.records;
      }
      // Jika response.data adalah object dengan data savings di dalamnya
      else if (typeof response.data === 'object') {
        // Cari property yang berisi array
        const possibleKeys = ['savings', 'records', 'data'];
        for (const key of possibleKeys) {
          if (response.data[key] && Array.isArray(response.data[key])) {
            data = response.data[key];
            break;
          }
        }
      }
    }
    
    return data;
  }

  // Menghitung total target dan total terkumpul
  _calculateTotals() {
    this.totalTarget = 0;
    this.totalCollected = 0;
    this.savingsList.forEach(s => {
      this.totalTarget += Number(s.target) || 0;
      this.totalCollected += Number(s.terkumpul) || 0;
    });
  }

  // Menghapus savings
  async deleteSavings(savingsId) {
    try {
      const response = await ApiService.deleteSavings(savingsId);
      if (response.success) {
        this.alert = 'Savings berhasil dihapus';
        this.alertType = 'success';
        await this.fetchSavingsData();
        return { success: true, message: this.alert };
      } else {
        this.alert = response.message || 'Gagal menghapus savings';
        this.alertType = 'error';
        return { success: false, message: this.alert };
      }
    } catch (err) {
      this.alert = 'Terjadi kesalahan saat menghapus savings';
      this.alertType = 'error';
      console.error('Delete savings error:', err);
      return { success: false, message: this.alert };
    }
  }

  // Transfer savings ke balance
  async transferToBalance(savingsId) {
    try {
      const response = await ApiService.deleteSavings(savingsId);
      if (response.success) {
        this.alert = 'Savings successfully transferred';
        this.alertType = 'transfer';
        await this.fetchSavingsData();
        return { success: true, message: this.alert, alertType: this.alertType };
      } else {
        this.alert = response.message || 'Failed to transfer savings';
        this.alertType = 'error';
        return { success: false, message: this.alert, alertType: this.alertType };
      }
    } catch (err) {
      this.alert = 'An error occurred during the savings transfer.';
      this.alertType = 'error';
      console.error('Delete savings error:', err);
      return { success: false, message: this.alert, alertType: this.alertType };
    }
  }

  // Memperbarui target savings
  async updateSavingsTarget(savingsId, newTarget) {
    if (!savingsId || !newTarget) return { success: false, message: 'Data tidak lengkap' };
    
    try {
      const response = await ApiService.updateSavingsTarget(savingsId, newTarget);
      
      if (response.success) {
        this.alert = 'Target tabungan berhasil diperbarui';
        this.alertType = 'success';
        await this.fetchSavingsData();
        return { success: true, message: this.alert, alertType: this.alertType };
      } else {
        this.alert = response.message || 'Gagal memperbarui target tabungan';
        this.alertType = 'error';
        return { success: false, message: this.alert, alertType: this.alertType };
      }
    } catch (err) {
      this.alert = 'Terjadi kesalahan saat memperbarui target tabungan';
      this.alertType = 'error';
      console.error('Update target error:', err);
      return { success: false, message: this.alert, alertType: this.alertType };
    }
  }

  // Mengatur savings yang dipilih untuk diedit
  setSelectedSavings(savings) {
    this.selectedSavings = savings;
    return savings;
  }

  // Mendapatkan savings yang dipilih
  getSelectedSavings() {
    return this.selectedSavings;
  }
}