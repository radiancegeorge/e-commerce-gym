const asyncHandler = require("express-async-handler");
const db = require("../../../models");

exports.createSizes = asyncHandler(async (req, res) => {
  const newSizes = await db.sizes.create(req.body);
  res.status(201).send(newSizes);
});

exports.updateSizes = asyncHandler(async (req, res) => {
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
  const { id } = req.params;
  await db.sizes.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});
