const express = require("express");
const createCommunity = require("./CreateCommunity");
const joinCommunity = require("./ JoinCommunity");
const createPost = require("./CreatePost");
const getAllCommunities = require("./getAllCommunities");
const getCommunityPosts = require("./getCommunityPosts");

const router = express.Router();

router.use(createCommunity);
router.use(joinCommunity);
router.use(getAllCommunities);
router.use(createPost);
router.use(getCommunityPosts);

module.exports = { CommunityRouter: router };
