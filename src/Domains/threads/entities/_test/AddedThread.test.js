const AddedThread = require("../AddedThread");

describe("a AddedThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "abc",
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: true,
      title: "abc",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "abc",
      owner: "user-123",
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toStrictEqual(payload.id);
    expect(title).toStrictEqual(payload.title);
    expect(owner).toStrictEqual(payload.owner);
  });
});
