class GetComments {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, is_deleted, content } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.is_deleted = is_deleted;
    if (this.is_deleted) {
      this.content = "**komentar telah dihapus**";
    } else {
      this.content = content;
    }
  }
  _verifyPayload(payload) {
    const { id, username, date, is_deleted, content } = payload;
    if (!id || !username || !date || !is_deleted === undefined || !content) {
      throw new Error("GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      !(typeof date === "string" || typeof date === 'object') ||
      typeof is_deleted !== "boolean" ||
      typeof content !== "string"
    ) {
      throw new Error("GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = GetComments;
