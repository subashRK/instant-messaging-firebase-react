import { Box, LinearProgress, makeStyles, TextField } from "@material-ui/core"
import { useState } from "react"
import { auth, firestore, storage } from "../firebase"
import PhotoIcon from '@material-ui/icons/Photo';
import { v4 } from "uuid"

const useStyles = makeStyles({
  addMessageForm: {
    display: "flex"
  },
  addMessageTextField: {
    width: "100%",
    marginRight: 10
  },
  photoIcon: {
    alignSelf: "flex-end",
    cursor: "pointer"
  }
})

const AddMessage = ({ name }) => {
  const [message, setMessage] = useState("")
  const [progress, setProgress] = useState(0)

  const classes = useStyles()

  const addMessage = e => {
    e.preventDefault()

    if (message.trim() !== "") {
      try {
        firestore.collection(`rooms/${name}/chats`).add({
          user: { email: auth.currentUser.email, photoURL: auth.currentUser.photoURL },
          message: message,
          timeStamp: new Date()
        })
      } catch({ message }) {
        alert(message)
      }
    }

    setMessage("")
  }

  const addPhoto = async e => {
    const id = v4()
    const file = e.target.files[0]
    
    if (file && file.type.includes("image")) {
      try {
        const uploadTask = storage.ref("/messages").child(id).put(file)

        uploadTask.on("state_changed", (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        }, ({ message }) => {
          alert(message)
        }, async () => {
          const url = await uploadTask.snapshot.ref.getDownloadURL()       
          
          try {
            await firestore.collection(`rooms/${name}/chats`).doc(id).set({
              user: { email: auth.currentUser.email, photoURL: auth.currentUser.photoURL },
              photoURL: url,
              timeStamp: new Date()
            })

            setTimeout(() => setProgress(0), 3000)
          } catch({ message }) {
            alert(message)
          } 
        })
      } catch({ message }) {
        alert(message)
      }
    } else {
      alert("Invalid image!")
    }

    e.target.value = ""
  }

  return (
    <Box
      component="form"
      flex={0.1}
      p={2}
      boxShadow={1}
      onSubmit={addMessage}
    >
      <LinearProgress
        variant="buffer"
        valueBuffer={100}
        value={progress}
        style={{ marginBottom: 15 }}
      />

      <div className={classes.addMessageForm}>
        <TextField 
          className={classes.addMessageTextField} 
          placeholder="Message"
          size="small"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <label className={classes.photoIcon}>
          <input 
            type="file" 
            onChange={addPhoto} 
            style={{ display: "none" }}
          />
          <PhotoIcon />
        </label>
      </div>
    </Box>
  )
}

export default AddMessage
