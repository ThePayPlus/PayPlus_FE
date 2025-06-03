// Model untuk struktur data savings
export class SavingsModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.namaSavings = data.namaSavings || '';
    this.deskripsi = data.deskripsi || '';
    this.target = data.target || 0;
    this.terkumpul = data.terkumpul || 0;
  }

  // Metode untuk mengecek apakah target sudah tercapai
  isTargetAchieved() {
    return this.terkumpul >= this.target;
  }

  // Metode untuk memformat angka ke format Rupiah
  static formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
  }
}