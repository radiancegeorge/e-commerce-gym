const asyncHandler = require("express-async-handler");
const db = require("../../../models");
const checkValidation = require("../../middlewares/checkValidation");

exports.createColor = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const newColor = await db.colors.create(req.body);
  res.status(201).send(newColor);
});

exports.updateColor = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { name } = req.body;
  const { id } = req.params;
  const [update] = await db.colors.update(
    { name },
    {
      where: {
        id,
      },
    }
  );
  update
    ? res.status(200).send(await db.colors.findOne({ where: { id } }))
    : res.status(400).send({ message: "nothing to update!" });
});

exports.deleteColor = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  await db.colors.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});

exports.getColors = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { limit, page } = req.query;
  const offset = (page - 1) * limit;
  const [colors, count] = await Promise.all([
    await db.colors.findAll({
      limit,
      offset,
    }),
    await db.colors.count(),
  ]);

  res.send({
    results: colors,
    page,
    totalPages: Math.ceil(count / limit),
    count,
  });
});
