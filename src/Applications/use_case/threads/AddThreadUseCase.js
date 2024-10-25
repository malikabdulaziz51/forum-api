const AddThread = require("../../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addedThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
