class Friend {
  constructor(id = '', name = '', phone = '', status = 'offline', lastSeen = null, avatar = null) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.status = status;
    this.lastSeen = lastSeen || new Date();
    this.avatar = avatar;
  }

  static fromJson(json) {
    return new Friend(json.id, json.name, json.phone, json.status || 'offline', json.lastSeen ? new Date(json.lastSeen) : new Date(), json.avatar);
  }

  getStatusText() {
    if (this.status === 'online') return 'Online';
    if (this.lastSeen) {
      const now = new Date();
      const diff = now - this.lastSeen;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} hari yang lalu`;
      if (hours > 0) return `${hours} jam yang lalu`;
      if (minutes > 0) return `${minutes} menit yang lalu`;
      return 'Baru saja';
    }
    return 'Offline';
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
    return new FriendRequest(json.id, json.name, json.phone, json.status || 'pending');
  }
}

export { Friend, FriendRequest };
