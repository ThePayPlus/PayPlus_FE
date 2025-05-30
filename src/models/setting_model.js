class Setting {
  constructor(name = '', email = '', phone = '', profileImage = null) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.profileImage = profileImage;
  }

  static fromJson(json) {
    return new Setting(
      json.name || '',
      json.email || '',
      json.phone || '',
      null
    );
  }
}

export default Setting;