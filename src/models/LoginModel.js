export class LoginModel {
  constructor(phone = '', password = '', rememberMe = false) {
    this.phone = phone;
    this.password = password;
    this.rememberMe = rememberMe;
  }

  setField(field, value) {
    this[field] = value;
  }

  getData() {
    return {
      phone: this.phone,
      password: this.password,
      rememberMe: this.rememberMe
    };
  }
}