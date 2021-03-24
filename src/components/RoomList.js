import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core"
import { auth } from "../firebase"

const RoomList = ({ rooms, getMessages }) => {
  const handleClick = room => {
    if (room.allowedUsers.includes(auth.currentUser.email)) {
      getMessages(room.name)
    } else {
      alert(
        `You dont have permissions to access the chat messages of this room '${room.name}'. Ask the admin of this room to participate in this room`
      )
    }
  }

  return (
    <Box overflow="scroll" className="room-list">
      {
        rooms.map(item => {
          const room = item.data()

          return (
            <ListItem
              className="room-tile"
              key={room.name} 
              button
              onClick={() => handleClick(room)}
            >
              <ListItemAvatar children={
                  <Avatar 
                    src={room.name} 
                    alt={room.name.toUpperCase()}
                  />
                } 
              />

              <div className="list-item-text">
                <ListItemText>
                  <Typography style={{ marginBottom: -5 }}>
                    {room.name}
                  </Typography>
                </ListItemText>

                <ListItemText>
                  <Typography style={{ fontSize: "0.9rem" }}>
                    admin: {room.admin}
                  </Typography>
                </ListItemText>
              </div>
            </ListItem>
          )
        })
      }
    </Box>
  )
}

export default RoomList
