const asyncHandler = require("express-async-handler");
const db = require("../../../models");

exports.createColor = asyncHandler(async (req, res) => {
  const newColor = await db.colors.create(req.body);
  res.status(201).send(newColor);
});

exports.updateColor = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  await db.colors.update(
    { name },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).send();
});

exports.deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.colors.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});
