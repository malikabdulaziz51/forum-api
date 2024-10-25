const GetComments = require("../GetComments");

describe("a GetComments entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah komentar",
    };

    // Action and Assert
    expect(() => new GetComments(payload)).toThrowError(
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
    expect(() => new GetComments(payload)).toThrowError(
      "GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when date is not type string or object", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: 123,
      is_deleted: true,
      content: "sebuah komentar",
    };

    // Action and Assert
    expect(() => new GetComments(payload)).toThrowError(
      "GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it('should return content "**komentar telah dihapus**" when is_deleted is true', () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      is_deleted: true,
      content: "sebuah komentar",
    };

    // Action
    const getComments = new GetComments(payload);

    // Assert
    expect(getComments.content).toStrictEqual("**komentar telah dihapus**");
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
    const getComments = new GetComments(payload);

    // Assert
    expect(getComments.content).toStrictEqual("sebuah komentar");
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
    const getComments = new GetComments(payload);

    // Assert
    expect(getComments).toBeInstanceOf(GetComments);
    expect(getComments.id).toStrictEqual(payload.id);
    expect(getComments.username).toStrictEqual(payload.username);
    expect(getComments.date).toStrictEqual(payload.date);
    expect(getComments.content).toStrictEqual(payload.content);
    expect(getComments.is_deleted).toStrictEqual(false);
  });
});
