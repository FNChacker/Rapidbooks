const asyncHandler = require("express-async-handler");
const Model = require("../components/Models");
const Model2 = require("../components/Models2");

const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await Model.find();
  res.status(200).json(accounts);
});

const createAccount = asyncHandler(async (req, res) => {
  console.log("The requested body is: ", req.body);
  const { name, balances } = req.body;
  if (!name || !balances) {
    res.status(400);
    throw new Error("All fields are Mandatory!!");
  }
  const account = await Model.create({
    name,
    balances,
  });
  res.status(201).json(account);
});

const createinvoice = asyncHandler(async (req, res) => {
  const { date, customerId, accountArray, totalAmount, invoiceNumber, year } =
    req.body;
  if (
    !date ||
    !customerId ||
    !accountArray ||
    !totalAmount ||
    !invoiceNumber ||
    !year
  ) {
    return res.status(400).json({ message: "All fields are compulsory." });
  }
  if (accountArray.length < 1) {
    return res
      .status(400)
      .json({ message: "Account array should have at least one object." });
  }
  const accountIds = accountArray.map((account) => account.accountId);
  const accountsExist = await Model.find({ _id: { $in: accountIds } });
  if (accountIds.length !== accountsExist.length) {
    return res
      .status(400)
      .json({ message: "All accountId should be present in DB." });
  }
  const invoiceExists = await Model2.findOne({
    invoiceNumber: invoiceNumber,
    year: year,
  });
  if (invoiceExists) {
    return res.status(400).json({
      message:
        "Same invoice number should not be already present for the same year.",
    });
  }
  const accountTotal = accountArray.reduce(
    (total, account) => total + account.amount,
    0
  );
  if (accountTotal !== totalAmount) {
    return res.status(400).json({
      message:
        "Total of amount in AccountArray should be equal to Total Amount.",
    });
  }

  const invoice = await Model2.create({
    date,
    customerId,
    accountArray,
    totalAmount: totalAmount,
    invoiceNumber,
    year,
  });

  for (const account of accountArray) {
    Model.findOne({ _id: account.accountId })
      .then((existingAccount) => {
        if (!existingAccount) {
          throw new Error(`Account with id ${account.accountId} not found`);
        }
        existingAccount.balances.find(
          (balance) => balance.year === year
        ).balance += account.amount;
        return existingAccount.save();
      })
      .catch((err) => {
        console.error(`Error updating account balance: ${err}`);
      });
  }
  res.status(201).json(invoice);
});

const listinvoice = asyncHandler(async (req, res) => {
  const { skip, limit, searchText } = req.query;

  const searchString = searchText ? searchText.toString() : "";

  const searchCriteria = searchString
    ? {
        $or: [
          { invoiceNumber: { $regex: searchString, $options: "i" } },
          { "accountArray.accountId": { $regex: searchString, $options: "i" } },
          { "accountArray.amount": { $regex: searchString, $options: "i" } },
        ],
      }
    : {};

  const invoices = await Model2.find(searchCriteria)
    .skip(parseInt(skip))
    .limit(parseInt(limit));

  res.status(201).json(invoices);
});
module.exports = { getAccounts, createAccount, createinvoice, listinvoice };
