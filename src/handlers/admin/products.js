const asyncHandler = require("express-async-handler");
const db = require("../../../models");

exports.createProduct = asyncHandler(async (req, res) => {
  const newProduct = await db.products.create(req.body);
  //process files and send response;
  console.log(req.files);

  res.status(201).send();
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.products.update(req.body, {
    where: {
      id,
    },
  });
  //process files if any
  console.log(req.files);

  res.status(200).send();
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.products.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});
