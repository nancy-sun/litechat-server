const express = require("express");
const router = express.Router();
const { userJoinVoice, getUsersInRm, createNewRoom, getSingleRoom, newUserJoin, deleteRoom, userLeft, postMessage, deleteMsg } = require("../controller/roomController");

router.route("/")
    .get(getUsersInRm)
    .post(createNewRoom);

router.route("/:roomID")
    .get(getSingleRoom)
    .delete(deleteRoom)
    .post(postMessage);

router.route("/:roomID/msg/:msgID")
    .delete(deleteMsg);

router.route("/:roomID/:userID")
    .delete(userLeft)


router.route("/:roomID/user")
    .put(userJoinVoice)
    .post(newUserJoin)


module.exports = router;