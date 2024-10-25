const DeleteReply = require("../DeleteReply");

describe("a DeleteReply entities", () => {
  it("should throw error if payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      "DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error if payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: true,
      owner: "user-123",
      threadId: 123,
      commentId: 123,
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      "DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it('should create deleteReply correctly', () => {
    // Arrange
    const payload = {
      id: "reply-123",
      owner: "user-123",
      threadId: "thread-123",
      commentId: "comment-123",
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply.id).toStrictEqual(payload.id);
    expect(deleteReply.owner).toStrictEqual(payload.owner);
    expect(deleteReply.threadId).toStrictEqual(payload.threadId);
    expect(deleteReply.commentId).toStrictEqual(payload.commentId);
  })
});
