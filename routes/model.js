const express = require("express");
const router = express.Router();
const {
  getAccounts,
  createAccount,
  createinvoice,
  listinvoice,
} = require("../controllers/accountController");

router.route("/createaccount").get(getAccounts);
router.route("/createaccount").post(createAccount);
router.route("/createinvoice").post(createinvoice);
router.route("/invoicelist").get(listinvoice);

module.exports = router;
