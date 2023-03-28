const asyncHandler = require("express-async-handler");
const db = require("../../../models");
const checkValidation = require("../../middlewares/checkValidation");
// const sharp = require("sharp");
const fs = require("fs");
const rs = require("randomstring");

exports.createProduct = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const t = await db.sequelize.transaction();
  try {
    fs.mkdirSync("./uploads", {
      recursive: true,
    });
    const uploads = await Promise.all(
      req.files.map(async (data) => {
        //generate name
        const name = data.fieldname + Date.now() + rs.generate(16) + ".jpeg";
        //compress image
        if (process.env.HOSTING !== "c-panel") {
          await sharp(data.buffer)
            .resize(630)
            .jpeg({ quality: 50 })
            .toFile(`./uploads/${name}`);
          return {
            url: process.env.SERVER_URL + "/" + name,
          };
        } else {
          return await new Promise((resolve, reject) => {
            fs.writeFile(
              `./uploads/${name}`,
              data.buffer,
              "binary",
              function (err) {
                // Handle any errors
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  resolve({
                    url: process.env.SERVER_URL + "/" + name,
                  });
                }
              }
            );
          });
        }
      })
    );
    const newProduct = await db.products.create(
      { ...req.body, images: uploads },
      { transaction: t, include: [db.images] }
    );
    t.commit();
    res.status(201).send(newProduct);
  } catch (err) {
    t.rollback();
    throw { status: 400, error: err };
  }
});

exports.updateProductPrice = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const { price } = req.body;
  const [update] = await db.products.update(
    { price },
    {
      where: {
        id,
      },
    }
  );
  update
    ? res.status(200).send(await db.products.findOne({ where: { id } }))
    : res
        .status(400)
        .send({ message: "No update made, does this product exist?" });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const images = await db.images.findAll({
    where: {
      productId: id,
    },
  });
  await db.products.destroy({
    where: {
      id,
    },
  });

  for (let image of images) {
    const { url } = image;
    const fileName = url.split("/")[url.split("/").length - 1];
    fs.unlinkSync(`./uploads/${fileName}`);
    console.log("deleted :: " + fileName);
  }
  //
  res.status(204).send();
});

exports.addColor = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { colorIds } = req.body;
  const { id } = req.params;

  const product = await db.products.findOne({
    where: {
      id,
    },
  });

  const addedColors = await product.addColors(colorIds);
  res.send(addedColors);
});
exports.removeColors = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { colorIds } = req.body;
  const { id } = req.params;

  const product = await db.products.findOne({
    where: {
      id,
    },
  });

  await product.removeColors(colorIds);
  res.status(204).send();
});
exports.addSizes = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { sizeIds } = req.body;
  const { id } = req.params;

  const product = await db.products.findOne({
    where: {
      id,
    },
  });

  const addedSizes = await product.addSizes(sizeIds);
  res.send(addedSizes);
});
exports.removeSizes = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { sizeIds } = req.body;
  const { id } = req.params;

  const product = await db.products.findOne({
    where: {
      id,
    },
  });
  await product.removeSizes(sizeIds);
  res.status(204).send();
});
exports.addCategories = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const { categoryId } = req.body;
  const product = await db.products.findOne({
    where: {
      id,
    },
  });
  const addedCategory = await product.setCategory(categoryId);
  res.send(addedCategory);
});
exports.removeCategories = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const product = await db.products.findOne({
    where: {
      id,
    },
  });

  product.categoryId = null;
  await product.save();
  res.status(204).send();
});
exports.addCollection = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const { collectionId } = req.body;
  const product = await db.products.findOne({
    where: {
      id,
    },
  });
  const addedCollection = await product.setCollection(collectionId);
  res.send(addedCollection);
});
exports.removeCollection = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const product = await db.products.findOne({
    where: {
      id,
    },
  });

  product.collectionId = null;
  await product.save();
  res.status(204).send();
});
