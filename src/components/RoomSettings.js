import { Button, Card, makeStyles, TextField, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { arrayRemove, arrayUnion, auth, firestore } from "../firebase"

const useStyles = makeStyles({
  roomCard: {
    width: 350,
    minWidth: 250,
    padding: 15,
    textAlign: "center"
  },
  submitButton: {
    marginTop: 7,
    width: "100%",
    padding: 3
  }
})

const RoomSettings = ({ rooms, roomName, setMessages }) => {
  const [room, setRoom] = useState(null)
  const [admin, setAdmin] = useState(false)
  const [newUser, setNewUser] = useState("")

  const classes = useStyles()

  const history = useHistory()

  useEffect(() => {
    const res = rooms.find(item => item.id === roomName)

    if (res) {
      setRoom(res.data())
      res.data().admin === auth.currentUser.email && setAdmin(true)
    }
  }, [rooms, roomName])

  const isAlreadyUser = () => {
    const user = room.allowedUsers.find(email => newUser === email)
    return user ? true : false
  }

  const addAllowedUser = async e => {
    e.preventDefault()

    try {
      if (!isAlreadyUser()) {
        await firestore.collection(`rooms`).doc(room.name).update({ allowedUsers: arrayUnion(newUser) })
        setNewUser("")
      } else {
        alert("User already exists!")
      }
    } catch({ message }) {
      alert(message)
    }
  }

  const removeAllowedUser = async () => {
    try {
      if (isAlreadyUser()) {
        await firestore.collection(`rooms`).doc(room.name).update({ allowedUsers: arrayRemove(newUser) })
        setNewUser("")
      } else {
        alert("No user exists!")
      }
    } catch({ message }) {
      alert(message)
    }
  }

  const deleteRoom = async () => {
    const res = window.confirm("Are you sure about deleting this room?")

    if (!res) return

    if (room.admin === auth.currentUser.email) {
      try {
        await firestore.collection(`rooms`).doc(room.name).delete()
        setMessages(null)
        history.replace("/")
      } catch(e) {
        alert("You cannot delete this room!")
      }
    } else {
      alert("You cannot delete this room!")
    }
  }

  return (
    <div className="center">
      {
        room !== null && (
          <Card className={classes.roomCard}>
            {
              admin &&  (
                <>
                  <form onSubmit={addAllowedUser} style={{ marginBottom: 15 }}>
                    <TextField
                      style={{ width: "100%" }}
                      onChange={e => setNewUser(e.target.value)}
                      value={newUser}
                      placeholder="New Allowed User's Email"
                      size="small"
                      type="email"
                    />
                    <Button
                      className={classes.submitButton}
                      variant="contained"
                      disableElevation
                      type="submit"
                    >
                      Add User
                    </Button>
                    <Button
                      className={classes.submitButton}
                      variant="contained"
                      disableElevation
                      onClick={removeAllowedUser}
                    >
                      Remove User
                    </Button>
                    <Button
                      className={classes.submitButton}
                      variant="contained"
                      disableElevation
                      onClick={deleteRoom}
                    >
                      Delete Room
                    </Button>
                  </form>
                </>
              )
            }

            <Typography style={{ 
                fontSize: "0.95rem",
                marginBottom: 15
              }}>admin: {room.admin}</Typography>

            <Typography style={{ marginBottom: 10 }}>Allowed Users</Typography>

            <div className="allowed-users-list">
              {
                room.allowedUsers.map((email, i) => (
                  <Typography key={i} style={{ fontSize: "0.9rem", textAlign: "left" }}>{i + `. ${email}`}</Typography>
                ))
              }
            </div>
          </Card>
        )
      }
    </div>
  )
}

export default RoomSettings
