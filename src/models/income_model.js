import { ApiService} from '../services/apiService.js';

class IncomeModel {
  // Mengambil data income dari API
  static async getIncomeRecords() {
    return await ApiService.getIncomeRecords();
  }
}

export default IncomeModel;