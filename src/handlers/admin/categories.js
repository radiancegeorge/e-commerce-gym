const asyncHandler = require("express-async-handler");
const db = require("../../../models");

exports.createCategory = asyncHandler(async (req, res) => {
  const newCategory = await db.categories.create(req.body);
  res.status(201).send(newCategory);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  await db.categories.update(
    {
      name,
    },
    {
      where: {
        id,
      },
    }
  );
  res.send(200);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.body;
  await db.categories.destroy({
    where: {
      id,
    },
  });

  res.send(204);
});
