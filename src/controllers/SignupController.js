import { ApiService } from '../services/apiService.js';
import { SignupModel } from '../models/SignupModel.js';

export class SignupController {
  constructor() {
    this.model = new SignupModel();
  }

  updateField(name, value) {
    this.model.setField(name, value);
    return this.model.getData();
  }

  validate() {
    const { password, confirmPassword } = this.model.getData();
    if (password !== confirmPassword) {
      return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true };
  }

  async register() {
    const { name, phone, email, password } = this.model.getData();
    return await ApiService.register(name, phone, email, password);
  }
}