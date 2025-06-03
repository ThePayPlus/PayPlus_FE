import { ApiService } from '../services/apiService';

class TopUpModel {
  constructor() {
    this.bankOptions = [
      { name: 'BRI', image: require('../assets/BRI.png') },
      { name: 'BCA', image: require('../assets/BCA.png') },
      { name: 'BNI', image: require('../assets/BNI.png') },
      { name: 'Mandiri', image: require('../assets/mandiri.png') },
      { name: 'Bank Jatim', image: require('../assets/jatim.png') },
      { name: 'Bank Bali', image: require('../assets/bali.png') },
      { name: 'Bank BJB', image: require('../assets/bjb.png') },
      { name: 'Bank Kalteng', image: require('../assets/kalteng.png') },
      { name: 'Bank Sumsel', image: require('../assets/sumsel.png') },
    ];
  }

  async topUp(amount) {
    try {
      const response = await ApiService.topup(amount);
      return response;
    } catch (error) {
      console.error('Topup error:', error);
      throw error;
    }
  }

  getBankOptions() {
    return this.bankOptions;
  }

  getBankImage(bankName) {
    const bank = this.bankOptions.find(bank => bank.name === bankName);
    return bank ? bank.image : null;
  }
}

export default TopUpModel;