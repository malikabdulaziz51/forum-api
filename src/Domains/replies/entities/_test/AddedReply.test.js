const AddedReply = require("../AddedReply");

describe("AddedReply entities", () => {
  it("should throw error if payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "reply-123",
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error if payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: true,
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it('should create addedReply correctly', () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "sebuah balasan",
      owner: "user-123",
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toStrictEqual(payload.id);
    expect(addedReply.content).toStrictEqual(payload.content);
    expect(addedReply.owner).toStrictEqual(payload.owner);
  });
});
