import { useState } from "react"
import { Box, Button, makeStyles, TextField } from "@material-ui/core"
import "../firebase"
import { auth, firestore } from "../firebase"

const useStyles = makeStyles({
  profileCard: {
    height: "100vh",
  },
  textField: {
    width: "100%"
  },
  groupButton: {
    flex: 0.5
  }
})

const RoomActions = ({ isNewRoom, searchRoom }) => {
  const [roomName, setRoomName] = useState("")
  const [disabled, setDisabled] = useState(true)

  const classes = useStyles()

  const handleChange = (e) => {
    const value = e.target.value

    if (value.trim() === "") {
      setDisabled(true)
    } else {
      setDisabled(false)
    }

    setRoomName(value)
  }

  const createRoom = async () => {
    console.log(isNewRoom(roomName))
    if (!isNewRoom(roomName)) {
      alert("A room with that name already exists.")
    } else {
      try {
        await firestore.collection("rooms").doc(roomName).set({
          name: roomName,
          admin: auth.currentUser.email,
          allowedUsers: [auth.currentUser.email]
        })
      } catch(e) {
        alert("A  with that name already exists.")
      }
    }

    setRoomName("")
    setDisabled(true)
  }

  return (
    <Box
      p={2}
      boxShadow={2}
    >
      <TextField 
        variant="filled" 
        label="Room Name"
        size="small"
        onChange={handleChange}
        value={roomName}
        className={classes.textField}
      />

      <div variant="contained" className="btn-group">
        <Button 
          className={classes.groupButton}
          style={{ marginRight: 3 }}
          variant="contained"
          color="primary"
          onClick={createRoom}
          disabled={disabled}
        >
          Create
        </Button>
        <Button 
          className={classes.groupButton} 
          style={{ marginLeft: 3 }}
          variant="contained" 
          color="secondary"
          onClick={() => searchRoom(roomName)}
        >
          Search
        </Button>
      </div>
    </Box>
  )
}

export default RoomActions
