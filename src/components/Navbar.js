import { AppBar, Avatar, IconButton, makeStyles, Typography } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import LoadingBar from "./LoadingBar"
import SettingsIcon from "@material-ui/icons/Settings"
import DeleteIcon from '@material-ui/icons/Delete';
import { auth, firestore, storage } from "../firebase";

const useStyles = makeStyles({
  navbar: {
    width: "100vw",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 21,
    letterSpacing: 1.3,
    cursor: "pointer"
  },
  avatar: {
    backgroundColor: "orange",
    cursor: "pointer"
  }
})

const Navbar = ({ currentUser, loading, room, currentMessage, name, setCurrentMessage }) => {
  const history = useHistory()
  const classes = useStyles()

  const handleDelete = async () => {
    const res = window.confirm("Are you sure about deleting this message?")

    try {
      if (res && room && currentMessage.data().user.email === auth.currentUser.email) {
        if (currentMessage.photoURL) {
          try {
            await storage.ref(`/messages/${currentMessage.id}`).delete()
          } catch({ message }) {
            console.log(message)
            alert("Something went wrong!")
          }
        }

        await firestore.collection(`rooms/${name}/chats`).doc(currentMessage.id).delete()
        setCurrentMessage(null)
      } else {
        alert("You cannot delete this message")
      }
    } catch(e) {
      alert("You cannot delete this message")
    }
  }

  return (
    <AppBar className={classes.navbar} style={{ padding: currentUser ? 10 : loading ? 10 : 18 }} position="sticky">
      <Typography className={classes.title} variant="h1" onClick={() => history.replace("/")}>
        Instant Messaging
      </Typography>

      {
        loading ? <LoadingBar /> : (
          currentUser && (
            <div style={{
              display: "flex",
              alignItems: "center",
            }}>
              {
                room && (
                  <div style={{ display: "flex", flexDirection: 'row' }}>
                    {
                      currentMessage && (
                        <>
                          <IconButton style={{ marginRight: 15, padding: 8 }} onClick={handleDelete}>
                            <DeleteIcon style={{
                              cursor: "pointer",
                              color: "#fffff8"
                            }} />
                          </IconButton>
                        </>
                      )
                    }
                    <IconButton style={{ marginRight: 15, padding: 8 }} onClick={() => history.replace('/room/settings')}>
                      <SettingsIcon style={{
                        cursor: "pointer",
                        color: "#fffff8"
                      }} />
                    </IconButton>
                  </div>
                )
              }
              <Avatar
                className={classes.avatar}
                src={currentUser.photoURL}
                alt={currentUser.displayName ?? currentUser.email}
                onClick={() => history.replace("/profile")}
              />
            </div>
          ) 
        )
      }
    </AppBar>
  )
}

export default Navbar
