const express = require("express");
const router = express.Router();
const { getUsersInRm, getRoomList, createNewRoom, getSingleRoom, newUserJoin, deleteRoom, userLeft, postMessage, deleteMsg, getAllUsers } = require("../controller/roomController");

router.route("/")
    .get(getUsersInRm)
    .post(createNewRoom);

router.route("/:roomID")
    .get(getSingleRoom)
    .delete(deleteRoom)
    .post(postMessage);

router.route("/:roomID/users")
    .get(getAllUsers)

router.route("/:roomID/msg/:msgID")
    .delete(deleteMsg);

router.route("/:roomID/:userID")
    .post(newUserJoin)
    .delete(userLeft)




module.exports = router;