// Model untuk struktur data savings - Kelas ini berfungsi sebagai representasi data tabungan dalam aplikasi
export class SavingsModel {
  // Constructor menerima parameter data opsional dengan nilai default objek kosong
  // Digunakan untuk membuat instance baru dari model savings dengan data yang diberikan
  constructor(data = {}) {
    this.id = data.id || null;                 // ID unik untuk tabungan, default null jika tidak ada
    this.namaSavings = data.namaSavings || ''; // Nama tabungan, default string kosong jika tidak ada
    this.deskripsi = data.deskripsi || '';     // Deskripsi tabungan, default string kosong jika tidak ada
    this.target = data.target || 0;            // Jumlah target tabungan yang ingin dicapai, default 0 jika tidak ada
    this.terkumpul = data.terkumpul || 0;      // Jumlah uang yang sudah terkumpul dalam tabungan, default 0 jika tidak ada
  }

  // Metode untuk mengecek apakah target tabungan sudah tercapai
  // Return: boolean - true jika jumlah terkumpul >= target, false jika belum
  isTargetAchieved() {
    return Number(this.terkumpul) >= Number(this.target);  // Konversi ke number sebelum membandingkan
  }

  // Metode statis untuk memformat angka ke format mata uang Rupiah
  // Parameter: amount - jumlah uang yang akan diformat
  // Return: string - jumlah uang dalam format Rupiah (contoh: "Rp 1.000.000")
  static formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;  // Mengkonversi amount ke Number, default 0 jika null/undefined
                                                              // Kemudian memformat dengan toLocaleString menggunakan locale Indonesia
                                                              // Dan menambahkan prefix "Rp " di depan angka
  }
}