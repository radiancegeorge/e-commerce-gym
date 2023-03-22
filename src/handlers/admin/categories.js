const asyncHandler = require("express-async-handler");
const db = require("../../../models");
const checkValidation = require("../../middlewares/checkValidation");

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
  res.status(200).send();
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.categories.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});

exports.getCategories = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { limit, page } = req.query;
  const offset = (page - 1) * limit;
  const [categories, count] = await Promise.all([
    await db.categories.findAll({
      limit,
      offset,
    }),
    await db.categories.count(),
  ]);

  res.send({
    results: categories,
    page,
    totalPages: Math.ceil(count / limit),
    count,
  });
});
