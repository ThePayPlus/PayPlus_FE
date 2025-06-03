class Friend {
  constructor(id = '', name = '', phone = '', status = '') {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.status = status; // online, offline, etc.
  }

  static fromJson(json) {
    return new Friend(
      json.id,
      json.name,
      json.phone,
      json.status || 'online'
    );
  }
}

class FriendRequest {
  constructor(id = '', name = '', phone = '', status = 'pending') {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.status = status;
  }

  static fromJson(json) {
    return new FriendRequest(
      json.id,
      json.name,
      json.phone,
      json.status || 'pending'
    );
  }
}

export { Friend, FriendRequest };