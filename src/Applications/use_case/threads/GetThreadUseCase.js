class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getComments(threadId);

    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
        const replies = await this._repliesRepository.getReplies(comment.id);
        return { ...comment, replies };
    }));

    thread.comments = commentsWithReplies;

    return thread;
}
}

module.exports = GetThreadUseCase;
