import BillModel from '../models/BillModel';

class BillController {
  // Metode untuk mengambil data tagihan
  static async fetchBills(setLoading, setBills, setError, setNotifications, setTotalBillAmount, setBillsByCategory) {
    try {
      setLoading(true);
      const response = await BillModel.getBills();
      
      if (response.success && response.data && response.data.bills) {
        const sortedBills = response.data.bills.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        
        setBills(sortedBills);
        
        // Buat notifikasi berdasarkan status tagihan
        const notifications = this.checkBillsStatus(sortedBills);
        setNotifications(notifications);
        
        // Hitung total tagihan
        const total = this.calculateTotalBillAmount(sortedBills);
        setTotalBillAmount(total);
        
        // Kelompokkan tagihan berdasarkan kategori
        const byCategory = this.groupBillsByCategory(sortedBills);
        setBillsByCategory(byCategory);
      } else {
        setError(response.message || "Gagal memuat data tagihan");
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga");
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  }

  // Metode untuk menambahkan tagihan baru
  static async addBill(newBill, setLoading, setError, setSuccessMessage, resetForm, closeForm, refreshBills) {
    try {
      setLoading(true);
      
      // Validasi input
      if (!newBill.name || !newBill.amount || !newBill.dueDate || !newBill.category) {
        setError("All fields must be filled in");
        return;
      }
      
      const response = await BillModel.addBill(
        newBill.name,
        parseFloat(newBill.amount),
        newBill.dueDate,
        newBill.category
      );
      
      if (response.success) {
        setSuccessMessage("Bill added successfully");
        resetForm();
        closeForm();
        refreshBills();
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(response.message || "Failed to add bill");
      }
    } catch (err) {
      setError("An error occurred while adding a bill");
      console.error("Error adding bill:", err);
    } finally {
      setLoading(false);
    }
  }

  // Metode untuk memperbarui tagihan
  static async updateBill(editingBill, setLoading, setError, setSuccessMessage, resetEditingBill, closeForm, refreshBills) {
    try {
      setLoading(true);
      
      // Validasi input
      if (!editingBill.name || !editingBill.amount || !editingBill.dueDate || !editingBill.category) {
        setError("All fields must be filled in");
        return;
      }
      
      const response = await BillModel.updateBill(
        editingBill.id,
        editingBill.name,
        parseFloat(editingBill.amount),
        editingBill.dueDate,
        editingBill.category
      );
      
      if (response.success) {
        setSuccessMessage("Bill updated successfully");
        resetEditingBill();
        closeForm();
        refreshBills();
        
        // Hilangkan pesan sukses setelah 3 detik
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(response.message || "Failed to update bill");
      }
    } catch (err) {
      setError("An error occurred while updating the bill");
      console.error("Error updating bill:", err);
    } finally {
      setLoading(false);
    }
  }

  // Metode untuk menghapus tagihan
  static async deleteBill(billId, editingBill, setLoading, setError, setSuccessMessage, resetEditingBill, closeForm, refreshBills) {
    if (!window.confirm("Are you sure you want to mark this bill as paid?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await BillModel.deleteBill(billId);
      
      if (response.success) {
        setSuccessMessage("The bill has been paid");
        
        if (editingBill && editingBill.id === billId) {
          resetEditingBill();
          closeForm();
        }
        
        refreshBills();
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(response.message || "Failed to mark bill as paid");
      }
    } catch (err) {
      setError("An error occurred while marking the bill as paid.");
      console.error("Error marking bill as paid:", err);
    } finally {
      setLoading(false);
    }
  }
  
  // Metode untuk menangani perubahan input
  static handleInputChange(e, editingBill, setEditingBill, newBill, setNewBill) {
    const { name, value } = e.target;
    if (editingBill) {
      setEditingBill({
        ...editingBill,
        [name]: value
      });
    } else {
      setNewBill({
        ...newBill,
        [name]: value
      });
    }
  }
  
  // Metode untuk menangani pengeditan tagihan
  static handleEditBill(bill, setEditingBill, setShowAddBillForm) {
    setEditingBill(bill);
    setShowAddBillForm(true);
  }
  
  // Metode untuk membatalkan pengeditan
  static handleCancelEdit(setEditingBill, setShowAddBillForm) {
    setEditingBill(null);
    setShowAddBillForm(false);
  }
  
  // Metode untuk menghapus notifikasi
  static dismissNotification(notificationId, notifications, setNotifications) {
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  }
  
  // Metode untuk toggle kategori
  static toggleCategoryExpand(category, setExpandedCategories) {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

export default BillController;