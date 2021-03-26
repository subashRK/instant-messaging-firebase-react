import { Box, makeStyles } from "@material-ui/core"
import { useEffect, useState } from "react"
import RoomActions from "./RoomActions"
import RoomList from "./RoomList"

const useStyle = makeStyles({
  roomListContainer: {
    display: "flex",
    flexDirection: "column",
    height: "90.6vh"
  }
})

const RoomListContainer = ({ rooms: chatRooms, getMessages }) => {
  const [rooms, setRooms] = useState([])

  const classes = useStyle()

  useEffect(() => {
    setRooms(chatRooms)
  }, [chatRooms])

  const isNewRoom = name => {
    const availableRoom = chatRooms.find(item => item.id === name)

    return availableRoom ? false : true
  }

  const searchRoom = (name) => {
    const res = chatRooms.filter(item => item.id.toLowerCase().trim().includes(name.toLowerCase().trim()))
    setRooms(res)
  }

  return (
    <Box
      flex={0.3}
      boxShadow={2}
      className={classes.roomListContainer}
    >
      <RoomActions isNewRoom={isNewRoom} searchRoom={searchRoom} />
      <RoomList rooms={rooms} getMessages={getMessages} />
    </Box>
  )
}

export default RoomListContainer
