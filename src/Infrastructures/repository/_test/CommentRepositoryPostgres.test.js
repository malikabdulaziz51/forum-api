const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("a CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(() => {
    pool.end();
  });

  describe("addComment function", () => {
    it("should persist add comment and return added comment correctly", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await UsersTableTestHelper.addUser({});
      const newComment = new AddComment({
        content: "abc",
        owner: "user-123",
        threadId: "thread-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await UsersTableTestHelper.addUser({});
      const newComment = new AddComment({
        content: "abc",
        owner: "user-123",
        threadId: "thread-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "abc",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-123")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("softDeleteComment function", () => {
    it("should soft delete comment correctly", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await UsersTableTestHelper.addUser({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment("comment-123");

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments[0].is_deleted).toStrictEqual(true);
    });
  });

  describe("getComments function", () => {
    it("should return comments in thread correctly", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await UsersTableTestHelper.addUser({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getComments(
        "thread-123"
      );

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toStrictEqual("comment-123");
      expect(comments[0].content).toStrictEqual("abc");
      expect(comments[0].username).toStrictEqual("dicoding");
      expect(comments[0].date).toBeInstanceOf(Date);
      expect(comments[0].is_deleted).toStrictEqual(false);
    });
  });

  describe("verifyIsOwner function", () => {
    it("should throw error when comment is not owned by owner", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await UsersTableTestHelper.addUser({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyIsOwner("comment-123", "user-1234")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw error when comment is owned by owner", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await UsersTableTestHelper.addUser({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyIsOwner("comment-123", "user-123")
      ).resolves.not.toThrowError();
    });
  });
  
});
