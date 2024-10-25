const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("thread endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  it("should response 201 and persisted thread", async () => {
    // Arrange
    const requestPayload = {
      title: "abc",
      body: "abc",
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

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(201);
    expect(responseJson.status).toStrictEqual("success");
    expect(responseJson.data.addedThread).toBeDefined();
  });

  it("should response 400 when request payload not contain needed property", async () => {
    // Arrange
    const requestPayload = {
      body: "abc",
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

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/threads",
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
      "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
    );
  });

  it("should response 400 when request payload not meet data type specification", async () => {
    // Arrange
    const requestPayload = {
      title: "abc",
      body: ["abc"],
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

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/threads",
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
      "tidak dapat membuat thread baru karena tipe data tidak sesuai"
    );
  });

  it("should response 401 when access token not contain in headers", async () => {
    // Arrange
    const requestPayload = {
      title: "abc",
      body: "abc",
    };
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
    });

    // Assert
    expect(response.statusCode).toStrictEqual(401);
  });

  it("should response 200 and return thread", async () => {
    // Arrange
    const requestPayload = {
      title: "abc",
      body: "abc",
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
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseThread = JSON.parse(thread.payload);

    // Action
    const response = await server.inject({
      method: "GET",
      url: `/threads/${responseThread.data.addedThread.id}`,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(200);
    expect(responseJson.status).toStrictEqual("success");
    expect(responseJson.data.thread).toBeDefined();
  });

  it("should return thread with comment and replies", async () => {
    // Arrange
    const requestPayload = {
      title: "abc",
      body: "abc",
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
      payload: requestPayload,
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
      payload: {
        content: "sebuah reply",
      },
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });
    const responseReply = JSON.parse(reply.payload); 

    // Action
    const response = await server.inject({
      method: "GET",
      url: `/threads/${responseThread.data.addedThread.id}`,
      headers: {
        Authorization: `Bearer ${responseAuth.data.accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toStrictEqual(200);
    expect(responseJson.status).toStrictEqual("success");
    expect(responseJson.data.thread).toBeDefined();
    expect(responseJson.data.thread.id).toStrictEqual(
      responseThread.data.addedThread.id
    );
    expect(responseJson.data.thread.title).toStrictEqual(requestPayload.title);
    expect(responseJson.data.thread.body).toStrictEqual(requestPayload.body);

    expect(responseJson.data.thread.comments).toBeDefined();
    expect(responseJson.data.thread.comments).toHaveLength(1);
    expect(responseJson.data.thread.comments[0].id).toStrictEqual(responseComment.data.addedComment.id);
    expect(responseJson.data.thread.comments[0].content).toStrictEqual("sebuah comment");

    expect(responseJson.data.thread.comments[0].replies).toBeDefined();
    expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
    expect(responseJson.data.thread.comments[0].replies[0].id).toStrictEqual(responseReply.data.addedReply.id);
    expect(responseJson.data.thread.comments[0].replies[0].content).toStrictEqual("sebuah reply");
  });
});
