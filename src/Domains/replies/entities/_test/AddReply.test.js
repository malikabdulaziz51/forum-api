const AddReply = require("../AddReply");
describe("a AddReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    //Arrange
    const payload = {
      content: "abc",
    };

    //Action & Assert
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
      commentId: 123,
      threadId: 123,
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it('should create addReply correctly', () => {
    // Arrange
    const payload = {
      content: "abc",
      commentId: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply.content).toStrictEqual(payload.content);
    expect(addReply.commentId).toStrictEqual(payload.commentId);
    expect(addReply.threadId).toStrictEqual(payload.threadId);
    expect(addReply.owner).toStrictEqual(payload.owner);
  });
});
