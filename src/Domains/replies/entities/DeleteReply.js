class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, owner, threadId, commentId } = payload;
    this.id = id;
    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({ id, owner, threadId, commentId }) {
    if (!id || !owner || !threadId || !commentId) {
      throw new Error("DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof owner !== "string" ||
      typeof threadId !== "string" ||
      typeof commentId !== "string"
    ) {
      throw new Error("DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteReply;
