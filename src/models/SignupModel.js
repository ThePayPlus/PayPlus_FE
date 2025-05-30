export class SignupModel {
  constructor(name = '', phone = '', email = '', password = '', confirmPassword = '') {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  setField(field, value) {
    this[field] = value;
  }

  getData() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };
  }
}