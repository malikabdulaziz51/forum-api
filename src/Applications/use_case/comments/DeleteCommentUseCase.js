const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const deleteComment = new DeleteComment(payload);
    await this._threadRepository.verifyAvailableThread(deleteComment.thread);
    await this._commentRepository.verifyAvailableComment(
      deleteComment.id
    );
    await this._commentRepository.verifyIsOwner(
      deleteComment.id,
      deleteComment.owner
    );
    return this._commentRepository.deleteComment(deleteComment.id);
  }
}

module.exports = DeleteCommentUseCase;
