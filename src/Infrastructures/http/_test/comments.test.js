const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("comment endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  it("should response 201 and persisted comment", async () => {
    // Arrange
    const requestPayload = {
      content: "sebuah comment",
    };
    const server = await createServer(container);

    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });

    const auth = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "dicoding",
        password: "secret",
      },
    });
    const responseAuth = JSON.parse(auth.payload);

    const thread = await server.inject({
      method: "POST",
      url: "/threads",
      payload: {
        title: "abc",
        body: "abc",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseThread = JSON.parse(thread.payload);

    // Action
    const response = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(201);
    expect(responseJson.status).toStrictEqual("success");
    expect(responseJson.data.addedComment).toBeDefined();
  });

  it("should response 400 when request payload not contain needed property", async () => {
    // Arrange
    const requestPayload = {
      content: "sebuah comment",
    };
    const server = await createServer(container);

    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });

    const auth = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "dicoding",
        password: "secret",
      },
    });
    const responseAuth = JSON.parse(auth.payload);

    const thread = await server.inject({
      method: "POST",
      url: "/threads",
      payload: {
        title: "abc",
        body: "abc",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseThread = JSON.parse(thread.payload);

    // Action
    const response = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: {},
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(400);
    expect(responseJson.status).toStrictEqual("fail");
    expect(responseJson.message).toStrictEqual(
      "tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada"
    );
  });

  it("should response 400 when request payload not meet data type specification", async () => {
    // Arrange
    const requestPayload = {
      content: ["sebuah comment"],
    };
    const server = await createServer(container);

    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });

    const auth = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "dicoding",
        password: "secret",
      },
    });
    const responseAuth = JSON.parse(auth.payload);

    const thread = await server.inject({
      method: "POST",
      url: "/threads",
      payload: {
        title: "abc",
        body: "abc",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseThread = JSON.parse(thread.payload);

    // Action
    const response = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(400);
    expect(responseJson.status).toStrictEqual("fail");
    expect(responseJson.message).toStrictEqual(
      "tidak dapat membuat comment baru karena tipe data tidak sesuai"
    );
  });

  it('should response 404 when thread not found', async () => {
    // Arrange
    const requestPayload = {
      content: 'sebuah comment',
    };
    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const auth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuth = JSON.parse(auth.payload);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-1234/comments',
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(404);
    expect(responseJson.status).toStrictEqual('fail');
    expect(responseJson.message).toStrictEqual('Thread tidak ditemukan');
  })

  it('should return 200 when successfully delete comment', async () => {
    // Arrange
    const requestPayload = {
      content: 'sebuah comment',
    };
    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const auth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuth = JSON.parse(auth.payload);

    const thread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'abc',
        body: 'abc',
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseThread = JSON.parse(thread.payload);
    
    const comment = await server.inject({
      method: 'POST',
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseComment = JSON.parse(comment.payload);
    
    // Action
    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(200);
    expect(responseJson.status).toStrictEqual('success');
    expect(responseJson.message).toStrictEqual('Komentar berhasil dihapus');
  })
});
