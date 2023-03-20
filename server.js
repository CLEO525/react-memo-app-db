const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

const memo = require("./api/memo");
const todo = require("./api/todo");

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

// Set some defaults (required if your JSON file is empty)
db.defaults({
  memo: [],
  todo: [],
}).write();

server.post("/memo", memo.create);
server.get("/memo", memo.fetch);
server.put("/memo/:id", memo.update);
server.delete("/memo/:id", memo.destroy);

server.post("/todo", todo.create);
server.get("/todo", todo.fetch);
server.put("/todo/:id", todo.update);
server.delete("/todo/:id", todo.destroy);

server.use((req, res, next) => {
  res.status = 404;
  next(Error("not found"));
});

server.use((err, req, res, next) => {
  console.log(err);
  res.status(res.statusCode || 500);
  res.json({ error: err.message || "internal server error" });
});

server.listen(4000, () => {
  console.log("JSON Server is running");
  console.log(db.get("todo").value());
  console.log(db.get("memo").value());
});

module.exports = server;
