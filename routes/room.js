const express = require("express");
const router = express.Router();
const { getRoomList, createNewRoom, getSingleRoom, newUserJoin, deleteRoom, userLeft, postMessage, deleteMsg } = require("../controller/roomController");

router.route("/")
    .get(getRoomList)
    .post(createNewRoom);

router.route("/:roomID")
    .get(getSingleRoom)
    .delete(deleteRoom)
    .post(postMessage);

router.route("/:roomID/msg/:msgID")
    .delete(deleteMsg);

router.route("/:roomID/:userID")
    .post(newUserJoin)
    .delete(userLeft)


module.exports = router;