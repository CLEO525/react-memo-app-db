const create = async (req, res) => {
  const sid = shortid.generate();
  let { memo } = req.body;
  if (!memo) res.status(400).end("no memo");

  const memoList = db.get("memo").push({ id: sid, memo });
  await memoList.write();

  res.status(201).json({ item: memoList });
};

const fetch = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "no id" });

  const memoList = await db.get("memo").value();
  res.json({ item: memoList });
};

const update = async (req, res) => {
  const { id } = req.params;
  let body = req.body;

  const memoList = db.get("memo").find(id);
  if (!id) return res.status(400).json({ error: "no id" });

  Object.keys(body).forEach((key) => {
    let value = body[key];
    if (typeof value === "string") value = value.trim();
    if (key === "memo example" || value) {
      memoList[key] = value;
    }
  });
  await memoList.assign(value).write();
  res.json({ item: memoList });
};

const destroy = async (req, res) => {
  const { id } = req.params;
  await db.get("memo").remove({ id }).write();
  res.status(204).end();
};

module.exports = {
  create,
  fetch,
  update,
  destroy,
};
