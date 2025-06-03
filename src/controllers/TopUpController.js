import { ApiService } from '../services/apiService.js';
import { TopUpModel } from '../models/TopUpModel.js';

export class TopUpController {
  constructor(initialBank = '') {
    this.model = new TopUpModel(initialBank);
  }

  updateField(name, value) {
    this.model.setField(name, value);
    return this.model.getData();
  }

  resetForm() {
    this.model.setField('loading', true);
    this.model.setField('error', '');
    this.model.setField('result', null);
    this.model.setField('redirectCountdown', null);
    return this.model.getData();
  }

  async submitTopUp() {
    try {
      const { topupAmount } = this.model.getData();
      const response = await ApiService.topup(topupAmount);
      
      if (response.success) {
        this.model.setField('result', {
          message: response.message,
          amount: response.data.amount,
          newBalance: response.data.newBalance
        });
        this.model.setField('redirectCountdown', 3);
      } else {
        this.model.setField('error', response.message);
      }
      
      return response;
    } catch (error) {
      console.error('Topup error:', error);
      this.model.setField('error', 'Terjadi kesalahan saat melakukan top up');
      return { success: false, message: 'Terjadi kesalahan saat melakukan top up' };
    } finally {
      this.model.setField('loading', false);
    }
  }

  decrementRedirectCountdown() {
    const { redirectCountdown } = this.model.getData();
    if (redirectCountdown !== null && redirectCountdown > 0) {
      this.model.setField('redirectCountdown', redirectCountdown - 1);
    }
    return this.model.getData();
  }
}