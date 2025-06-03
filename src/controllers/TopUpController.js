import TopUpModel from '../models/TopUpModel';

class TopUpController {
  constructor() {
    this.model = new TopUpModel();
  }

  getBankOptions() {
    return this.model.getBankOptions();
  }

  getBankImage(bankName) {
    return this.model.getBankImage(bankName);
  }

  async processTopUp(amount) {
    try {
      const response = await this.model.topUp(amount);
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan saat melakukan top up'
      };
    }
  }
}

export default TopUpController;