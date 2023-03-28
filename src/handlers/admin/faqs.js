const asyncHandler = require("express-async-handler");
const db = require("../../../models");
const checkValidation = require("../../middlewares/checkValidation");

exports.createFaq = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const newFaq = await db.faq.create(req.body);
  res.status(201).send(newFaq);
});

exports.updateFaq = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  await db.faq.update(req.body, {
    where: {
      id,
    },
  });
  res.status(200).send();
});

exports.deleteFaq = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { id } = req.params;
  await db.faq.destroy({
    where: {
      id,
    },
  });

  res.status(204).send();
});

exports.getFaq = asyncHandler(async (req, res) => {
  await checkValidation(req);
  const { limit, page } = req.query;
  const offset = (page - 1) * limit;
  const [faqs, count] = await Promise.all([
    await db.faq.findAll({
      limit,
      offset,
    }),
    await db.faq.count(),
  ]);

  res.send({
    results: faqs,
    page,
    totalPages: Math.ceil(count / limit),
    count,
  });
});
