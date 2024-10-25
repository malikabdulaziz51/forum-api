const DeleteComment = require("../DeleteComment");

describe("a DeleteComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: {},
      owner: "user-123",
      thread: "thread-123",
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create deleteComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      owner: "user-123",
      thread: "thread-123",
    };

    // Action
    const { id, owner, thread } = new DeleteComment(payload);

    // Assert
    expect(id).toStrictEqual(payload.id);
    expect(owner).toStrictEqual(payload.owner);
    expect(thread).toStrictEqual(payload.thread);
  });
});
