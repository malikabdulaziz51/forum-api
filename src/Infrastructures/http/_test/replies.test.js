const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("replies endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  it("should response 201 and persisted reply", async () => {
    // Arrange
    const requestPayload = {
      content: "sebuah reply",
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
    const comment = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: {
        content: "sebuah comment",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseComment = JSON.parse(comment.payload);

    // Action
    const response = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toStrictEqual(201);
    expect(responseJson.status).toStrictEqual("success");
    expect(responseJson.data.addedReply).toBeDefined();
  });

  it("should response 400 when request payload not contain needed property", async () => {
    // Arrange
    const requestPayload = {
      content: "sebuah reply",
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
    const comment = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: {
        content: "sebuah comment",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseComment = JSON.parse(comment.payload);

    // Action
    const response = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
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
      "tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada"
    );
  });

  it("should response 400 when request payload not meet data type specification", async () => {
    // Arrange
    const requestPayload = {
      content: ["sebuah reply"],
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
    const comment = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: {
        content: "sebuah comment",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseComment = JSON.parse(comment.payload);

    // Action
    const response = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
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
      "tidak dapat membuat reply baru karena tipe data tidak sesuai"
    );
  });

  it('should return 404 when comment not found', async () => {
    // Arrange
    const requestPayload = {
      content: "sebuah reply",
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
      url: `/threads/${responseThread.data.addedThread.id}/comments/1/replies`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(404);
    expect(responseJson.status).toStrictEqual("fail");
    expect(responseJson.message).toStrictEqual("Komentar tidak ditemukan");
  })

  it('should return 401 when access token not contain in headers', async () => {
    // Arrange
    const requestPayload = {
      content: "sebuah reply",
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

    const comment = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: {
        content: "sebuah comment",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseComment = JSON.parse(comment.payload);

    // Action
    const response = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(401);
  })

  it('should return 200 when successfully delete reply', async () => {
    // Arrange
    const requestPayload = {
      content: "sebuah reply",
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

    const comment = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments`,
      payload: {
        content: "sebuah comment",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseComment = JSON.parse(comment.payload);

    const reply = await server.inject({
      method: "POST",
      url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseReply = JSON.parse(reply.payload);

    // Action
    const response = await server.inject({
      method: "DELETE",
      url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${responseReply.data.addedReply.id}`,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(200);
    expect(responseJson.status).toStrictEqual("success");
  })
});
