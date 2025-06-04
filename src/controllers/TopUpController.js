import { ApiService } from '../services/apiService';

export class TopUpController {
  constructor() {
    this.selectedBank = null;
    this.topupAmount = '';
    this.loading = false;
    this.result = null;
    this.error = '';
    this.redirectCountdown = null;
  }

  setSelectedBank(bank) {
    this.selectedBank = bank;
    return this.selectedBank;
  }

  setTopupAmount(amount) {
    this.topupAmount = amount;
    return this.topupAmount;
  }

  async submitTopUp() {
    this.loading = true;
    this.error = '';
    this.result = null;
    this.redirectCountdown = null;
    
    try {
      const response = await ApiService.topup(this.topupAmount);
      
      if (response.success) {
        this.result = {
          message: response.message,
          amount: response.data.amount,
          newBalance: response.data.newBalance
        };
        this.redirectCountdown = 3;
        return { success: true, result: this.result, redirectCountdown: this.redirectCountdown };
      } else {
        this.error = response.message;
        return { success: false, error: this.error };
      }
    } catch (error) {
      console.error('Topup error:', error);
      this.error = 'An error occurred while topping up';
      return { success: false, error: this.error };
    } finally {
      this.loading = false;
    }
  }

  updateRedirectCountdown() {
    if (this.redirectCountdown !== null && this.redirectCountdown > 0) {
      this.redirectCountdown -= 1;
    }
    return this.redirectCountdown;
  }
}

export default TopUpController;