export class TopUpModel {
  constructor(selectedBank = '', topupAmount = '', loading = false, result = null, error = '', redirectCountdown = null) {
    this.selectedBank = selectedBank;
    this.topupAmount = topupAmount;
    this.loading = loading;
    this.result = result;
    this.error = error;
    this.redirectCountdown = redirectCountdown;
  }

  setField(field, value) {
    this[field] = value;
  }

  getData() {
    return {
      selectedBank: this.selectedBank,
      topupAmount: this.topupAmount,
      loading: this.loading,
      result: this.result,
      error: this.error,
      redirectCountdown: this.redirectCountdown
    };
  }
}