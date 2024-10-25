const AddComment = require("../../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const comment = new AddComment(payload);
    await this._threadRepository.verifyAvailableThread(comment.threadId);
    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
