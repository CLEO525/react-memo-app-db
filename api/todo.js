const create = async (req, res) => {
  const sid = shortid.generate();
  let { id, todo, checked } = req.body;

  if (!todo) res.status(400).end("no todo");
  if (!id) res.status(400).end("no id");

  const todoList = db.get("todo").push({ id: sid, todo, checked });
  await todoList.write();

  res.status(201).json({ item: todoList });
};

const fetch = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "no id" });

  const todoList = await db.get("todo").value();
  res.json({ item: todoList });
};

const update = async (req, res) => {
  // req = {
  //        body: {
  //                todo: "tests",
  //                checked: false
  //              }
  //      }

  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id" });

  const todoItem = db.get("todo").find(id);
  await todoItem
    .assign({ id, todo: req.body.todo, checked: req.body.checked })
    .write();

  // Object.keys(body).forEach((key) => {
  //   let value = body[key];
  //   if (typeof value === "string") value = value.trim();
  // });
  // await todoList.assign(value).write();
  res.json({ item: todoItem });

  res.status(200).json();
};

const destroy = async (req, res) => {
  const { id } = req.params;
  await db.get("todo").remove({ id }).write();
  res.status(204).end();
};

module.exports = {
  create,
  fetch,
  update,
  destroy,
};
