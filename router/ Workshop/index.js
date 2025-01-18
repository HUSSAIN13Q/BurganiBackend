const express = require("express");
const { createWorkshop } = require("./createWorkshopHR");
const { applyForWorkshop } = require("./applyForWorkshop");
const { getWorkshop } = require("./GetWorkshops");
const { myWorkshop } = require("./myWorksohp");

const router = express.Router();

router.use(createWorkshop);
router.use(getWorkshop);
router.use(applyForWorkshop);
router.use(myWorkshop);

module.exports = { WorkshopRouter: router };
