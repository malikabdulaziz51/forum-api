const AddThread = require("../AddThread");

describe("a AddThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "abc",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "abc",
      body: true,
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      title: "abc",
      body: "abc",
      owner: "user-123",
    };

    // Action
    const { title, body, owner } = new AddThread(payload);

    // Assert
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
    expect(owner).toStrictEqual(payload.owner);
  });
});
