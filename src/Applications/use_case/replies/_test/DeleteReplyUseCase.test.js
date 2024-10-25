const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply action correctly", async () => {
    const useCasePayload = {
      id: "reply-123",
      owner: "user-123",
      commentId: "comment-123",
      threadId: "thread-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyIsOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalled();
    expect(mockCommentRepository.verifyAvailableComment).toBeCalled();
    expect(mockReplyRepository.verifyAvailableReply).toBeCalled();
    expect(mockReplyRepository.verifyIsOwner).toBeCalled();
    expect(mockReplyRepository.deleteReply).toBeCalled();
  });
});
