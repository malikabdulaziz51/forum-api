const GetReplies = require("../GetReplies");

describe("a GetReplies entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah komentar",
    };

    // Action and Assert
    expect(() => new GetReplies(payload)).toThrowError(
      "GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      is_deleted: true,
      content: "sebuah komentar",
    };

    // Action and Assert
    expect(() => new GetReplies(payload)).toThrowError(
      "GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return throw error when date is not type string or object", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: 123,
      is_deleted: true,
      content: "sebuah komen",
    };

    // Action & Assert
    expect(() => new GetReplies(payload)).toThrowError(
      "GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it('should return content "balasan telah dihapus" when is_deleted is true', () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      is_deleted: true,
      content: "sebuah balasan",
    };

    // Action
    const getReplies = new GetReplies(payload);

    // Assert
    expect(getReplies.content).toStrictEqual("**balasan telah dihapus**");
  });

  it("should return content when is_deleted is false", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      is_deleted: false,
      content: "sebuah komentar",
    };

    // Action
    const getReplies = new GetReplies(payload);

    // Assert
    expect(getReplies.content).toStrictEqual("sebuah komentar");
  });

  it("should return correct instance", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      is_deleted: false,
      content: "sebuah komentar",
    };

    // Action
    const getReplies = new GetReplies(payload);

    // Assert
    expect(getReplies).toBeInstanceOf(GetReplies);
  });
});
