const AddComment = require("../AddComment");

describe("a AddComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: null,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: true,
      owner: [],
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addComment object correctly", () => {
    // Arrange
    const payload = {
      content: "abc",
      threadId: "thread-123",
      owner: "user-123",
    };

    // Action
    const { content, threadId, owner } = new AddComment(payload);

    // Assert
    expect(content).toStrictEqual(payload.content);
    expect(threadId).toStrictEqual(payload.threadId);
    expect(owner).toStrictEqual(payload.owner);
  });
});
