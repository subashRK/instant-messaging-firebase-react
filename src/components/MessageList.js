import { useEffect, useRef } from "react"
import { Avatar, makeStyles } from "@material-ui/core"
import { auth } from "../firebase"
import moment from "moment"

const useStyles = makeStyles({
  userAvatar: {
    width: 30,
    height: 30,
    marginBottom: 5,
  }
})

const MessageList = ({ messages, setCurrentMessage }) => {
  const lastElRef = useRef()
  const classes = useStyles()

  useEffect(() => {
    lastElRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const deleteMessage = async item => {
    setCurrentMessage(item)
  }

  return (
    <div className="message-list">
      {messages.map(item => {
        const message = item.data()

        return (
          <div
            key={item.id}
            style={{
              alignSelf: message.user.email === auth.currentUser.email && "flex-end",
              padding: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              src={message.user.photoURL}
              alt={message.user.email}
              className={classes.userAvatar}
              style={{ alignSelf: message.user.email === auth.currentUser.email ? "flex-end" : "flex-start" }}
            />
            <span
              className={message.user.email === auth.currentUser.email ? "my-message" : "other-message"}
              onClick={() => deleteMessage(item)}
              style={{ cursor: "pointer" }}
            >
              {message.message ? message.message : (
                <img 
                  src={message.photoURL} 
                  alt={message.user.email + "'s message"}
                  width="250vw"
                  height="250vh"
                  style={{ objectFit: "cover" }}
                  className="message-photo"
                />
              )}
            </span>
            <span 
              style={{
                fontSize: "0.8rem",
                alignSelf: message.user.email === auth.currentUser.email ? "flex-end" : "flex-start",
                marginTop: 3,
                color: "rgb(65, 65, 65)"
              }}
            >
              {moment(message.timeStamp.toDate()).fromNow()}
            </span>
          </div>
        ) 
      })}

      <div ref={lastElRef} />
    </div>
  )
}

export default MessageList
