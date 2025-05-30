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
        const notifications = BillModel.checkBillsStatus(sortedBills);
        setNotifications(notifications);
        
        // Hitung total tagihan
        const total = BillModel.calculateTotalBillAmount(sortedBills);
        setTotalBillAmount(total);
        
        // Kelompokkan tagihan berdasarkan kategori
        const byCategory = BillModel.groupBillsByCategory(sortedBills);
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
        
        // Hilangkan pesan sukses setelah 3 detik
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
        
        // Hilangkan pesan sukses setelah 3 detik
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
}

export default BillController;