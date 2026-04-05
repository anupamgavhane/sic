const express = require('express')
const authUser =require('../middleware/auth.middleware')
const {createRoom,joinRoom,getRooms,getRoom,leaveRoom,removeUserFromRoom,getMyRooms,deleteRoom,editRoom}=require('../controllers/room.controller')

const router = express.Router()

router.post('/',authUser,createRoom);
router.post("/:roomId/join", authUser, joinRoom);
router.get('/',authUser,getRooms);
router.get("/my-rooms", authUser, getMyRooms);
router.get('/:roomId',authUser,getRoom);
router.post('/:roomId/leave',authUser,leaveRoom);
router.post("/:roomId/remove/:userId", authUser, removeUserFromRoom);
router.delete("/:roomId", authUser, deleteRoom);
router.patch("/:roomId", authUser, editRoom);





module.exports=router;