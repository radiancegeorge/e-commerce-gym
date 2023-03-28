const asyncHandler = require("express-async-handler");
const db = require("../../../models");
const checkValidation = require("../../middlewares/checkValidation");

exports.createSizes = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { name } = req.body;
  const newSizes = await db.sizes.create({ name });
  res.status(201).send(newSizes);
});

exports.updateSizes = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { name } = req.body;
  const { id } = req.params;
  await db.sizes.update(
    { name },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).send();
});

exports.deleteSizes = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  await db.sizes.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});

exports.getSizes = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { limit, page } = req.query;
  const offset = (page - 1) * limit;
  const [sizes, count] = await Promise.all([
    await db.sizes.findAll({
      limit,
      offset,
    }),
    await db.sizes.count(),
  ]);

  res.send({
    results: sizes,
    page,
    totalPages: Math.ceil(count / limit),
    count,
  });
});
