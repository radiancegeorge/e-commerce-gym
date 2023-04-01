const expressAsyncHandler = require("express-async-handler");
const checkValidation = require("../../middlewares/checkValidation");
const db = require("../../../models");
const { Op } = require("sequelize");

exports.getProducts = expressAsyncHandler(async (req, res) => {
  await checkValidation(req);
  const { limit, page, categories, collections, colors, sizes } = req.query;
  const offset = (page - 1) * limit;
  console.log(req.query);
  const { count, rows: products } = await db.products.findAndCountAll({
    include: [
      {
        model: db.colors,
        through: "productColors",
        ...(colors.length && {
          where: {
            id: {
              [Op.or]: colors,
            },
          },
        }),
      },
      {
        model: db.collections,
        ...(collections.length && {
          where: {
            id: {
              [Op.or]: collections,
            },
          },
        }),
      },
      {
        model: db.sizes,
        through: "productSizes",
        ...(sizes.length && {
          where: {
            id: {
              [Op.or]: sizes,
            },
          },
        }),
      },
      {
        model: db.categories,
        ...(categories.length && {
          where: {
            id: {
              [Op.or]: categories,
            },
          },
        }),
      },
      {
        model: db.images,
      },
    ],
    order: [["ID", "DESC"]],
    limit,
    offset,
  });

  res.send({
    count,
    results: products,
    limit,
    totalPages: Math.ceil(count / limit),
  });
});

exports.getSingleProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.products.findOne({
    where: {
      id,
    },
    include: [
      {
        model: db.colors,
        through: "ProductColors",
      },
      {
        model: db.sizes,
        through: "productSizes",
      },
      {
        model: db.categories,
      },
      {
        model: db.collections,
      },
      {
        model: db.images,
      },
    ],
  });

  res.send(product);
});
