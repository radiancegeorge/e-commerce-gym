const asyncHandler = require("express-async-handler");
const db = require("../../../models");
const checkValidation = require("../../middlewares/checkValidation");
const rs = require("randomstring");
const { Op } = require("sequelize");
exports.createCoupons = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const code = rs.generate(16);
  const newCoupon = await db.coupons.create({ ...req.body, code });
  res.status(201).send(newCoupon);
});

exports.updateCoupons = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  await db.coupons.update(req.body, {
    where: {
      id,
    },
  });
  res.status(200).send();
});

exports.deleteCoupons = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  await db.coupons.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});

exports.getCoupons = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { limit, page } = req.query;
  const offset = (page - 1) * limit;
  const [coupons, count] = await Promise.all([
    await db.coupons.findAll({
      limit,
      offset,
    }),
    await db.coupons.count(),
  ]);

  res.send({
    results: coupons,
    page,
    totalPages: Math.ceil(count / limit),
    count,
  });
});

exports.addProducts = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const { productIds } = req.body;
  const coupon = await db.coupons.findOne({
    where: {
      id,
      expiryDate: {
        [Op.gte]: new Date(),
      },
    },
  });
  const data = await coupon.addProducts(productIds);
  res.send(data);
});
exports.removeProducts = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  const { productIds } = req.body;
  const coupon = await db.coupons.findOne({
    where: {
      id,
      expiryDate: {
        [Op.gte]: new Date(),
      },
    },
  });
  await coupon.removeProducts(productIds);
  res.status(204).send();
});
