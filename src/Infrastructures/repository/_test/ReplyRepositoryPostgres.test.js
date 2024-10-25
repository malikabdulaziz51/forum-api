const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("a ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(() => {
    pool.end();
  });

  describe("addReply function", () => {
    it("should persist add reply and return added reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const newReply = {
        content: "abc",
        owner: "user-123",
        commentId: "comment-123",
      };

      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const newReply = {
        content: "abc",
        owner: "user-123",
        commentId: "comment-123",
      };

      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "abc",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyAvailableReply function", () => {
    it("should throw NotFoundError when reply not available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReply("reply-123")
      ).rejects.toThrowError("REPLY_REPOSITORY.NOT_FOUND");
    });
  });

  describe("getReplies function", () => {
    it("should return replies correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const replies = await replyRepositoryPostgres.getReplies("comment-123");

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toHaveProperty("id");
      expect(replies[0]).toHaveProperty("content");
      expect(replies[0]).toHaveProperty("username");
      expect(replies[0]).toHaveProperty("date");
      expect(replies[0].id).toStrictEqual("reply-123");
      expect(replies[0].content).toStrictEqual("abc");
      expect(replies[0].username).toStrictEqual("dicoding");
      expect(replies[0].date).toBeInstanceOf(Date);
    });
  });

  describe("deleteReply function", () => {
    it("should delete reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply("reply-123");

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies[0].is_deleted).toStrictEqual(true);
    });
  });

  describe("verifyIsOwner function", () => {
    it("should throw AuthorizationError when user is not the owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyIsOwner("reply-123", "user-124")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when user is the owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyIsOwner("reply-123", "user-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });
});
