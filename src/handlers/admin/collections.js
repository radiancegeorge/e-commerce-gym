const asyncHandler = require("express-async-handler");
const db = require("../../../models");
const checkValidation = require("../../middlewares/checkValidation");

exports.createCollection = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const newCollection = await db.collections.create(req.body);
  res.status(201).send(newCollection);
});

exports.updateCollection = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const [updated] = await db.collections.update(req.body, {
    where: {
      id,
    },
  });
  updated
    ? res.status(200).send(await db.collections.findOne({ where: { id } }))
    : res.status(400).send({ message: "An error occurred!" });
});

exports.deleteCollection = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  await db.collections.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});

exports.getCollections = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { limit, page } = req.query;
  const offset = (page - 1) * limit;
  const [collections, count] = await Promise.all([
    await db.collections.findAll({
      limit,
      offset,
    }),
    await db.collections.count(),
  ]);

  res.send({
    results: collections,
    page,
    totalPages: Math.ceil(count / limit),
    count,
  });
});
