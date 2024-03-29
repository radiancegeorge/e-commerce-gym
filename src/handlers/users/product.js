const expressAsyncHandler = require("express-async-handler");
const checkValidation = require("../../middlewares/checkValidation");
const db = require("../../../models");
const { Op } = require("sequelize");

exports.getProducts = expressAsyncHandler(async (req, res) => {
  await checkValidation(req);
  const userId = req.user?.id;
  const { limit, page, categories, collections, colors, sizes, sudo, search } =
    req.query;
  const offset = (page - 1) * limit;
  const { count, rows: products } = await db.products.findAndCountAll({
    where: {
      ...(!sudo && {
        stockAmount: {
          [Op.gt]: 0,
        },
      }),
      ...(search && {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      }),
    },

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
      {
        model: db.coupons,
        where: {
          expiryDate: {
            [Op.gt]: new Date(),
          },
        },
        required: false,
      },
      userId && {
        model: db.users,
        // attributes: [],
        where: {
          id: userId,
        },
        through: "usersWishList",
        required: false,
      },
    ].filter((item) => item),
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
  const userId = req.user?.id;
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
      {
        model: db.coupons,
        where: {
          expiryDate: {
            [Op.gt]: new Date(),
          },
        },
        required: false,
      },
      userId && {
        model: db.users,
        // attributes: [],
        where: {
          id: userId,
        },
        through: "usersWishList",
        required: false,
      },
    ].filter((data) => data),
  });

  res.send(product);
});

exports.getWishList = expressAsyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.user;
  const { limit, page } = req.query;
  const offset = (page - 1) * limit;
  const { count, rows: products } = await db.products.findAndCountAll({
    include: [
      {
        model: db.colors,
        through: "productColors",
      },
      {
        model: db.coupons,
        where: {
          expiryDate: {
            [Op.gt]: new Date(),
          },
        },
        required: false,
      },
      {
        model: db.categories,
      },
      {
        model: db.images,
      },
      {
        model: db.users,
        through: "usersWishList",
        where: {
          id,
        },
        attributes: [],
      },
    ],
    offset,
    limit,
  });

  res.send({
    results: products,
    totalPages: Math.ceil(count / limit),
    page,
    limit,
  });
});

exports.addToWishList = expressAsyncHandler(async (req, res) => {
  await checkValidation(req);
  const { productIds } = req.body;
  const { id } = req.user;
  const products = await db.products.findAll({
    where: {
      id: {
        [Op.or]: productIds,
      },
    },
  });
  for (let product of products) {
    await product.addUsers(id);
  }
  res.send();
});

exports.removeFromList = expressAsyncHandler(async (req, res) => {
  const { productIds } = req.body;
  const { id } = req.user;
  const products = await db.products.findAll({
    where: {
      id: {
        [Op.or]: productIds,
      },
    },
  });
  for (x of products) {
    await x.removeUser(id);
  }
  res.status(204).send();
});

exports.featuredProducts = expressAsyncHandler(async (req, res) => {
  const { limit } = req.query;
  const products = await db.products.findAll({
    order: db.Sequelize.literal("rand()"),
    include: [
      {
        model: db.sizes,
      },
      {
        model: db.images,
      },
      {
        model: db.colors,
      },
      {
        model: db.collections,
      },
      {
        model: db.categories,
      },
      {
        model: db.coupons,
        where: {
          expiryDate: {
            [Op.gt]: new Date(),
          },
        },
        required: false,
      },
    ],
    limit,
  });
  res.send(products);
});

exports.getCollectionsRandomImages = expressAsyncHandler(async (req, res) => {
  const { limit, page } = await checkValidation(req);
  const offset = (page - 1) * limit;
  const { rows: collections, count } = await db.collections.findAndCountAll({
    limit,
    offset,
    order: [["id", "desc"]],
  });
  const result = await Promise.all(
    collections.map(async (collection) => {
      //getting randomProducts
      const product = await db.products.findOne({
        where: {
          collectionId: collection.id,
        },
        include: {
          model: db.images,
        },
        order: db.sequelize.literal("RAND()"),
      });
      return {
        ...collection.dataValues,
        product,
      };
    })
  );
  res.send({
    results: result,
    limit,
    page,
    totalPages: Math.ceil(count / limit),
  });
});
