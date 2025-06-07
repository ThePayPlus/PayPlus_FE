// Mengimpor ApiService dari file apiService.js untuk melakukan operasi API terkait tabungan
import { ApiService } from '../services/apiService.js';
// Mengimpor model SavingsModel untuk membuat objek tabungan terstruktur
import { SavingsModel } from '../models/SavingsModel.js';

// Mendefinisikan dan mengekspor kelas SavingsController untuk mengelola logika bisnis terkait tabungan
export class SavingsController {
  // Konstruktor untuk inisialisasi properti kelas saat objek dibuat
  constructor() {
    this.savingsList = [];      // Array untuk menyimpan daftar tabungan
    this.totalTarget = 0;       // Menyimpan total target tabungan
    this.totalCollected = 0;    // Menyimpan total dana yang sudah terkumpul
    this.loading = true;        // Status loading untuk menunjukkan proses sedang berlangsung
    this.error = '';            // Menyimpan pesan error jika terjadi kesalahan
    this.alert = '';            // Menyimpan pesan alert untuk notifikasi
    this.alertType = '';        // Jenis alert (success, error, transfer, dll)
    this.selectedSavings = null; // Menyimpan tabungan yang sedang dipilih/aktif
  }

  // Metode untuk mengambil data tabungan dari API
  async fetchSavingsData() {
    try {
      // Mengaktifkan status loading
      this.loading = true;
      // Memanggil API untuk mendapatkan data tabungan
      const response = await ApiService.getSavings();

      // Memeriksa apakah respons berhasil
      if (response.success) {
        // Mengekstrak data tabungan dari respons menggunakan metode helper
        let data = this._extractDataFromResponse(response);

        // Mengkonversi setiap item data menjadi objek SavingsModel
        this.savingsList = data.map(item => new SavingsModel(item));
        // Menghitung total target dan dana terkumpul
        this._calculateTotals();
        // Mengosongkan pesan error karena operasi berhasil
        this.error = '';
        // Mengembalikan objek dengan status sukses dan data tabungan
        return {
          success: true,
          savingsList: this.savingsList,
          totalTarget: this.totalTarget,
          totalCollected: this.totalCollected
        };
      } else {
        // Jika respons tidak berhasil, simpan pesan error dari API atau pesan default
        this.error = response.message || 'Failed to load savings data';
        // Mengosongkan daftar tabungan
        this.savingsList = [];
        // Mengembalikan objek dengan status gagal dan pesan error
        return { success: false, error: this.error };
      }
    } catch (err) {
      // Menangani error yang tidak terduga
      this.error = 'An error occurred while loading data';
      // Mencatat error ke console untuk debugging
      console.error('Error when fetching savings data:', err);
      // Mengosongkan daftar tabungan
      this.savingsList = [];
      // Mengembalikan objek dengan status gagal dan pesan error
      return { success: false, error: this.error };
    } finally {
      // Menonaktifkan status loading setelah operasi selesai (berhasil atau gagal)
      this.loading = false;
    }
  }

  // Metode helper untuk mengekstrak data tabungan dari berbagai format respons API
  _extractDataFromResponse(response) {
    // Inisialisasi array kosong untuk menyimpan data tabungan
    let data = [];

    // Memeriksa apakah respons memiliki properti data
    if (response.data) {
      // Kasus 1: Jika response.data langsung berupa array
      if (Array.isArray(response.data)) {
        data = response.data;
      }
      // Kasus 2: Jika response.data.savings adalah array
      else if (response.data.savings && Array.isArray(response.data.savings)) {
        data = response.data.savings;
      }
      // Kasus 3: Jika response.data.records adalah array
      else if (response.data.records && Array.isArray(response.data.records)) {
        data = response.data.records;
      }
      // Kasus 4: Mencari array di dalam objek response.data
      else if (typeof response.data === 'object') {
        // Mendefinisikan kemungkinan kunci yang berisi array tabungan
        const possibleKeys = ['savings', 'records', 'data'];
        // Iterasi melalui kemungkinan kunci
        for (const key of possibleKeys) {
          // Jika kunci ditemukan dan nilainya adalah array
          if (response.data[key] && Array.isArray(response.data[key])) {
            // Simpan array tersebut dan hentikan iterasi
            data = response.data[key];
            break;
          }
        }
      }
    }

    // Mengembalikan data tabungan yang telah diekstrak
    return data;
  }

  // Metode helper untuk menghitung total target dan dana terkumpul dari semua tabungan
  _calculateTotals() {
    // Mengatur ulang total target dan dana terkumpul ke 0
    this.totalTarget = 0;
    this.totalCollected = 0;
    // Iterasi melalui setiap tabungan dalam daftar
    this.savingsList.forEach(s => {
      // Menambahkan target tabungan ke total target (konversi ke Number dan default ke 0 jika null/undefined)
      this.totalTarget += Number(s.target) || 0;
      // Menambahkan dana terkumpul ke total dana terkumpul (konversi ke Number dan default ke 0 jika null/undefined)
      this.totalCollected += Number(s.terkumpul) || 0;
    });
  }

  // Metode untuk menghapus tabungan berdasarkan ID
  async deleteSavings(savingsId) {
    try {
      // Memanggil API untuk menghapus tabungan
      const response = await ApiService.deleteSavings(savingsId);
      // Memeriksa apakah respons berhasil
      if (response.success) {
        // Jika berhasil, atur pesan alert sukses
        this.alert = 'Savings successfully deleted';
        this.alertType = 'success';
        // Memperbarui data tabungan setelah penghapusan
        await this.fetchSavingsData();
        // Mengembalikan objek dengan status sukses dan pesan alert
        return { success: true, message: this.alert };
      } else {
        // Jika gagal, atur pesan alert error dari API atau pesan default
        this.alert = response.message || 'Failed to delete savings';
        this.alertType = 'error';
        // Mengembalikan objek dengan status gagal dan pesan alert
        return { success: false, message: this.alert };
      }
    } catch (err) {
      // Menangani error yang tidak terduga
      this.alert = 'An error occurred while deleting savings';
      this.alertType = 'error';
      // Mencatat error ke console untuk debugging
      console.error('Delete savings error:', err);
      // Mengembalikan objek dengan status gagal dan pesan alert
      return { success: false, message: this.alert };
    }
  }

  // Metode untuk mentransfer dana tabungan ke saldo utama
  async transferToBalance(savingsId) {
    try {
      // Memanggil API untuk menghapus tabungan (yang akan mentransfer dana ke saldo)
      const response = await ApiService.deleteSavings(savingsId);
      // Memeriksa apakah respons berhasil
      if (response.success) {
        // Jika berhasil, atur pesan alert sukses transfer
        this.alert = 'Savings successfully transferred';
        this.alertType = 'transfer';
        // Memperbarui data tabungan setelah transfer
        await this.fetchSavingsData();
        // Mengembalikan objek dengan status sukses, pesan alert, dan jenis alert
        return { success: true, message: this.alert, alertType: this.alertType };
      } else {
        // Jika gagal, atur pesan alert error dari API atau pesan default
        this.alert = response.message || 'Failed to transfer savings';
        this.alertType = 'error';
        // Mengembalikan objek dengan status gagal, pesan alert, dan jenis alert
        return { success: false, message: this.alert, alertType: this.alertType };
      }
    } catch (err) {
      // Menangani error yang tidak terduga
      this.alert = 'An error occurred during the savings transfer';
      this.alertType = 'error';
      // Mencatat error ke console untuk debugging
      console.error('Delete savings error:', err);
      // Mengembalikan objek dengan status gagal, pesan alert, dan jenis alert
      return { success: false, message: this.alert, alertType: this.alertType };
    }
  }

  // Metode untuk memperbarui target tabungan
  async updateSavingsTarget(savingsId, newTarget) {
    // Validasi parameter: jika savingsId atau newTarget tidak ada, kembalikan error
    if (!savingsId || !newTarget) return { success: false, message: 'Incomplete data' };

    try {
      // Memanggil API untuk memperbarui target tabungan
      const response = await ApiService.updateSavingsTarget(savingsId, newTarget);

      // Memeriksa apakah respons berhasil
      if (response.success) {
        // Jika berhasil, atur pesan alert sukses
        this.alert = 'Savings target successfully updated';
        this.alertType = 'success';
        // Memperbarui data tabungan setelah update target
        await this.fetchSavingsData();
        // Mengembalikan objek dengan status sukses, pesan alert, dan jenis alert
        return { success: true, message: this.alert, alertType: this.alertType };
      } else {
        // Jika gagal, atur pesan alert error dari API atau pesan default
        this.alert = response.message || 'Failed to update savings target';
        this.alertType = 'error';
        // Mengembalikan objek dengan status gagal, pesan alert, dan jenis alert
        return { success: false, message: this.alert, alertType: this.alertType };
      }
    } catch (err) {
      // Menangani error yang tidak terduga
      this.alert = 'An error occurred while updating the savings target';
      this.alertType = 'error';
      // Mencatat error ke console untuk debugging
      console.error('Update target error:', err);
      // Mengembalikan objek dengan status gagal, pesan alert, dan jenis alert
      return { success: false, message: this.alert, alertType: this.alertType };
    }
  }

  // Metode untuk mengatur tabungan yang dipilih/aktif
  setSelectedSavings(savings) {
    // Menyimpan objek tabungan yang dipilih
    this.selectedSavings = savings;
    // Mengembalikan objek tabungan yang dipilih
    return savings;
  }

  // Metode untuk mendapatkan tabungan yang sedang dipilih/aktif
  getSelectedSavings() {
    // Mengembalikan objek tabungan yang dipilih
    return this.selectedSavings;
  }
}