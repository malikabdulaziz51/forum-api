const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const reply = new DeleteReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(reply.threadId);
    await this._commentRepository.verifyAvailableComment(reply.commentId);
    await this._replyRepository.verifyAvailableReply(reply.id);
    await this._replyRepository.verifyIsOwner(reply.id, reply.owner);
    return this._replyRepository.deleteReply(reply.id);
  }
}

module.exports = DeleteReplyUseCase;
