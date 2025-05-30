import { ApiService } from '../services/apiService.js';

class BillModel {
  // Metode untuk mendapatkan daftar tagihan
  static async getBills() {
    try {
      return await ApiService.getBills();
    } catch (err) {
      console.error("Error in BillModel.getBills:", err);
      return { success: false, message: "Terjadi kesalahan yang tidak terduga" };
    }
  }

  // Metode untuk menambahkan tagihan baru
  static async addBill(name, amount, dueDate, category) {
    try {
      return await ApiService.addBill(name, amount, dueDate, category);
    } catch (err) {
      console.error("Error in BillModel.addBill:", err);
      return { success: false, message: "Terjadi kesalahan saat menambahkan tagihan" };
    }
  }

  // Metode untuk memperbarui tagihan
  static async updateBill(billId, name, amount, dueDate, category) {
    try {
      return await ApiService.updateBill(billId, name, amount, dueDate, category);
    } catch (err) {
      console.error("Error in BillModel.updateBill:", err);
      return { success: false, message: "Terjadi kesalahan saat memperbarui tagihan" };
    }
  }

  // Metode untuk menghapus tagihan
  static async deleteBill(billId) {
    try {
      return await ApiService.deleteBill(billId);
    } catch (err) {
      console.error("Error in BillModel.deleteBill:", err);
      return { success: false, message: "Terjadi kesalahan saat menghapus tagihan" };
    }
  }
  
  // Fungsi untuk memformat mata uang
  static formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Fungsi untuk memformat tanggal
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Fungsi untuk memeriksa apakah tagihan sudah jatuh tempo
  static isOverdue(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const billDueDate = new Date(dueDate);
    billDueDate.setHours(0, 0, 0, 0);
    return billDueDate < today;
  }

  // Fungsi untuk memeriksa apakah tagihan jatuh tempo besok
  static isDueTomorrow(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const billDueDate = new Date(dueDate);
    billDueDate.setHours(0, 0, 0, 0);
    
    return billDueDate.getTime() === tomorrow.getTime();
  }

  // Fungsi untuk memeriksa status tagihan dan membuat notifikasi
  static checkBillsStatus(billsList) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newNotifications = [];
    
    billsList.forEach(bill => {
      const dueDate = new Date(bill.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      // Cek tagihan yang sudah jatuh tempo (overdue)
      if (dueDate < today) {
        newNotifications.push({
          id: `overdue-${bill.name}-${bill.dueDate}`,
          type: 'overdue',
          message: `Bill ${bill.name} of Rp ${this.formatCurrency(bill.amount)} is overdue since ${this.formatDate(bill.dueDate)}`,
          bill
        });
      } 
      // Cek tagihan yang akan jatuh tempo besok (H-1)
      else if (dueDate.getTime() === tomorrow.getTime()) {
        newNotifications.push({
          id: `due-tomorrow-${bill.name}-${bill.dueDate}`,
          type: 'due-tomorrow',
          message: `Bill ${bill.name} of Rp ${this.formatCurrency(bill.amount)} is due tomorrow`,
          bill
        });
      }
    });
    
    return newNotifications;
  }

  // Fungsi untuk mengelompokkan tagihan berdasarkan kategori
  static groupBillsByCategory(bills) {
    return bills.reduce((acc, bill) => {
      const category = bill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(bill);
      return acc;
    }, {});
  }

  // Fungsi untuk menghitung total tagihan
  static calculateTotalBillAmount(bills) {
    return bills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
  }
  
  // Fungsi untuk mendapatkan ikon kategori
  static getCategoryIcon(category) {
    // Fungsi ini akan diimplementasikan di View
    return category;
  }

  // Fungsi untuk mendapatkan warna kategori
  static getCategoryColor(category) {
    switch (category) {
      case "Rent":
        return "bg-indigo-200 text-indigo-800";
      case "Electricity":
        return "bg-indigo-200 text-indigo-800";
      case "Internet":
        return "bg-indigo-200 text-indigo-800";
      case "Water":
        return "bg-indigo-200 text-indigo-800";
      case "Vehicle":
        return "bg-indigo-200 text-indigo-800";
      case "Heart":
        return "bg-indigo-200 text-indigo-800";
      default:
        return "bg-indigo-200 text-indigo-800";
    }
  }
}

export default BillModel;