const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const GetDetailThread = require("../../Domains/threads/entities/GetDetailThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Thread tidak ditemukan");
    }
  }

  async addThread(addComment) {
    const { title, body, owner } = addComment;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: "SELECT threads.*, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    const thread = result.rows[0];
    return new GetDetailThread(thread);
  }
}

module.exports = ThreadRepositoryPostgres;
