import { ApiService } from '../services/apiService.js';
import { LoginModel } from '../models/LoginModel.js';

export class LoginController {
  constructor() {
    this.model = new LoginModel();
  }

  updateField(name, value) {
    this.model.setField(name, value);
    return this.model.getData();
  }

  async login() {
    const { phone, password } = this.model.getData();
    return await ApiService.login(phone, password);
  }
}