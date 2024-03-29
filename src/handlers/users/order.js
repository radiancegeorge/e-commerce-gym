const expressAsyncHandler = require("express-async-handler");
const checkValidation = require("../../middlewares/checkValidation");
const db = require("../../../models");
const { Op } = require("sequelize");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createAddress = expressAsyncHandler(async (req, res) => {
  const data = await checkValidation(req);
  const { id } = req.user;

  const user = await db.users.findOne({
    where: { id },
  });
  if (!user) throw { status: 400, message: "user not found!" };
  const newAddress = await user.createDeliveryAddress(data);
  res.status(201).send(newAddress);
});

exports.createOrder = expressAsyncHandler(async (req, res) => {
  const { orders, deliveryAddress, addressId, couponCode, paymentId } =
    await checkValidation(req);
  const { id } = req.user;

  const user = await db.users.findOne({
    where: { id },
  });

  /* orders dataType = {
        productId: number,
        quantity: number,
        colorId: number,
        sizeId: number
    }[]
    */

  //get all requested products
  const { rows: products, count } = await db.products.findAndCountAll({
    where: {
      id: {
        [Op.or]: orders.map((order) => order.productId),
      },
      stockAmount: {
        [Op.gt]: 0,
      },
    },
    include: [
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
  });

  //check if all product found
  if (count !== orders.length)
    throw {
      status: 400,
      message: "An error occurred!, invalid product found!",
    };

  //generate individual total product price and add to order object
  const orderToBeSaved = Array(...orders).map((order) => {
    const product = products.find(
      (product) => Number(order.productId) === product.dataValues.id
    );

    //check for coupons and compute price
    const percentage = product.coupon?.discount ?? 0;

    const price =
      Number(product.price) -
      (Number(percentage) / 100) * Number(product.price);

    const total = price * Number(order.quantity);

    return { ...order, total };
  });

  // generate order total amd add coupon if any provided
  const { discount, id: coupon } = couponCode
    ? await db.coupons.findOne({
        where: {
          code: couponCode,
          expiryDate: {
            [Op.gt]: new Date(),
          },
        },
      })
    : { discount: 0 };

  const totalPriceFromProducts = orderToBeSaved.reduce(
    ({ total: prevDataPrice }, { total: currentDataPrice }) => {
      return { total: prevDataPrice + currentDataPrice };
    },
    { total: 0 }
  );

  //apply discount if any
  const total =
    totalPriceFromProducts.total -
    (Number(discount) / 100) * totalPriceFromProducts.total;

  //create order
  const t = await db.sequelize.transaction();
  try {
    const order = await db.orders.create(
      {
        total,
        ...(coupon && { couponId: coupon }),
        deliveryAddressId: !addressId
          ? (
              await user.createDeliveryAddress(deliveryAddress, {
                transaction: t,
              })
            ).id
          : addressId,
        status: "confirmed",
        userId: id,
      },
      { transaction: t }
    );
    // console.log(order);
    // const orderProducts = await order.addProducts(products, {
    //   transaction: t,
    //   through: {},
    // });

    for (let product of orderToBeSaved) {
      await order.addProduct(product.productId, {
        transaction: t,
        through: {
          ...product,
        },
      });

      //deduct available stock from product!
      const { quantity } = product;
      const productInstance = products.find(
        (productInstance) =>
          Number(productInstance.id) === Number(product.productId)
      );

      await productInstance.decrement("stockAmount", {
        by: quantity,
        transaction: t,
      });
    }
    const charges = await processPayment({ paymentId, amount: total * 100 });
    res.send({ ...order.dataValues, charges });
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw { status: 400, ...err };
  }
});

const processPayment = async ({ paymentId, amount, currency = "usd" }) => {
  const charges = await stripe.paymentIntents.create({
    payment_method: paymentId,
    amount,
    currency,
    confirm: true,
  });
  return charges;
};

exports.getOrders = expressAsyncHandler(async (req, res) => {
  const isAdmin = req.admin;
  const { limit, page, userId, email, status } = await checkValidation(req);
  const offset = (page - 1) * limit;

  const person =
    isAdmin &&
    email | userId &&
    (await db.users.findOne({
      where: {
        ...(userId && {
          userId,
        }),
        ...(email && {
          email,
        }),
      },
    }));
  // console.log(person, userId, email);
  const { count, rows: orders } = await db.orders.findAndCountAll({
    where: {
      ...(person &&
        isAdmin && {
          userId: person.id,
        }),
      ...(status && {
        status,
      }),
      ...(!isAdmin && {
        userId: req.user?.id,
      }),
    },
    include: [
      {
        model: db.users,
        attributes: {
          exclude: "password",
        },
      },
      {
        model: db.deliveryAddress,
      },
      {
        model: db.products,
        through: db.orderProducts,
        include: [
          {
            model: db.images,
          },
          {
            model: db.colors,
          },
          {
            model: db.sizes,
          },
        ],
      },
    ],
    limit,
    offset,
    order: [["id", "desc"]],
  });

  res.send({
    results: orders,
    page,
    limit,
    count,
    totalPages: Math.ceil(count / limit),
  });
});

exports.toggleOrder = expressAsyncHandler(async (req, res) => {
  const { orderId } = await checkValidation(req);
  const order = await db.orders.findOne({
    where: {
      orderId,
    },
  });
  if (!order) throw { status: 404, message: "order not found" };
  order.status = order.status === "confirmed" ? "delivered" : "confirmed";
  await order.save();

  res.status(200).send(await db.orders.findOne({ where: { orderId } }));
});

exports.getAddresses = expressAsyncHandler(async (req, res) => {
  const address = await db.deliveryAddress.findAll({
    where: {
      userId: req.user.id,
    },
  });

  res.send(address);
});
