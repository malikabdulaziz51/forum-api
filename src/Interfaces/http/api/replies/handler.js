const AddReplyUseCase = require("../../../../Applications/use_case/replies/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/replies/DeleteReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId: thread, commentId: comment } = request.params;
    request.payload.threadId = thread;
    request.payload.owner = owner;
    request.payload.commentId = comment;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    const payload = {
      id: replyId,
      threadId: threadId,
      commentId: commentId,
      owner,
    };
    await deleteReplyUseCase.execute(payload);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
