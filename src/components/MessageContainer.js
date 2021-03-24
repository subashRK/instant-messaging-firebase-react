import AddMessage from "./AddMessage"
import MessageList from "./MessageList"

const MessageContainer = ({ messages, name, setCurrentMessage }) => {
  return (
    <div className="message-container">
      <MessageList messages={messages} setCurrentMessage={setCurrentMessage} />
      <AddMessage name={name} />
    </div>
  )
}

export default MessageContainer
