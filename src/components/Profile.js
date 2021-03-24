import { Card, Avatar, makeStyles, Typography, Button, Divider } from "@material-ui/core"
import { useHistory } from "react-router"
import { auth } from "../firebase"

const useStyles = makeStyles({
  profileCard: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 250,
    width: 350
  }
})

const Profile = ({ currentUser }) => {
  const { email, photoURL, displayName } = currentUser

  const history = useHistory()
  const classes = useStyles()

  return (
    <div className="center">
      <Card
        className={classes.profileCard}
      >
        <Avatar 
          src={photoURL} 
          alt={displayName ?? email}
          style={{ backgroundColor: "orange", marginBottom: 5 }}
        />

        <Typography style={{ marginTop: 5 }}>
          Email: {email}
        </Typography>
        <Typography style={{ marginTop: 3, marginBottom: 10 }}>
          Username: {displayName}
        </Typography>

        <Divider style={{ width: "100%" }} />

        <Button
          style={{ marginTop: 10, width: "100%" }}
          variant="contained"
          color="primary"
          onClick={async () => {
            try {
              await auth.signOut()
            } catch({ message }) {
              alert(message)
            }
          }}
        >
          Sign out
        </Button>
        <Button
          style={{ marginTop: 3, width: "100%" }}
          variant="contained"
          color="secondary"
          onClick={() => history.replace("/")}
        >
          Go To Home
        </Button>
      </Card>
    </div>
  )
}

export default Profile
