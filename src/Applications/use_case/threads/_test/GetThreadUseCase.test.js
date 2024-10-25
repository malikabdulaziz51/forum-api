const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const GetComments = require("../../../../Domains/comments/entities/GetComments");
const GetReplies = require("../../../../Domains/replies/entities/GetReplies");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
const GetDetailThread = require("../../../../Domains/threads/entities/GetDetailThread");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const commentId = "comment-123";
    const replies = [
      new GetReplies({
        id: "reply-123",
        content: "abc",
        username: "user-123",
        date: "2021-08-08T07:22:33.555Z",
        is_deleted: false,
      }),
    ];

    const comments = [
      new GetComments({
        id: commentId,
        content: "abc",
        username: "user-123",
        date: "2021-08-08T07:22:33.555Z",
        is_deleted: false,
        replies: replies,
      }),
    ];

    const expectedThread = new GetDetailThread({
      id: threadId,
      title: "abc",
      body: "abc",
      username: "user-123",
      date: "2021-08-08T07:22:33.555Z",
      comments: comments,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockRepliesRepository.getReplies = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(threadId);

    // Assert
    expect(result).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments).toBeCalledWith(threadId);
    expect(mockRepliesRepository.getReplies).toBeCalledWith(commentId);
  });
});
