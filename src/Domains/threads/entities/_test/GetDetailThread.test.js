const GetDetailThread = require("../GetDetailThread");

describe("a GetDetailThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
    };

    // Action and Assert
    expect(() => new GetDetailThread(payload)).toThrowError(
      "GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      title: "abc",
      body: "abc",
      date: "2021-08-08T07:59:00.000Z",
      username: "dicoding",
    };

    // Action and Assert
    expect(() => new GetDetailThread(payload)).toThrowError(
      "GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return throw error when date is not type string or object", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "abc",
      body: "abc",
      date: 123,
      username: "dicoding",
    };

    // Action & Assert
    expect(() => new GetDetailThread(payload)).toThrowError(
      "GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create getDetailThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "abc",
      body: "abc",
      date: "2021-08-08T07:59:00.000Z",
      username: "dicoding",
    };

    // Action
    const { id, title, body, date, username } = new GetDetailThread(payload);

    // Assert
    expect(id).toStrictEqual(payload.id);
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
    expect(date).toStrictEqual(payload.date);
    expect(username).toStrictEqual(payload.username);
  });
});
