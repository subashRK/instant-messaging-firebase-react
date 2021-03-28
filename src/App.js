import './App.css';

// React
import { useEffect, useState } from 'react';
import { auth, firestore, GoogleProvider } from "./firebase"

// React Router Dom
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

// Material UI theme
import { Button, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { deepPurple, blueGrey } from '@material-ui/core/colors';

// Components
import LoadingBar from './components/LoadingBar';
import Navbar from './components/Navbar';
import RoomListContainer from './components/RoomListContainer';
import MessageContainer from './components/MessageContainer';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import RoomSettings from './components/RoomSettings';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[500]
    },
    secondary: {
      main: blueGrey[900]
    }
  }
})

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [messages, setMessages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState([])
  const [currentMessage, setCurrentMessage] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          await firestore.collection("rooms").onSnapshot(data => {
            setRooms(data.docs)
            setLoading(false)
          })
        } catch({ message }) {
          alert(message)
        }
      } else {
        setRooms([])
        setMessages(null)
        setLoading(false)
      }

      setCurrentUser(user)
    })
  }, [])

  const getMessages = async name => {
    try {
      await firestore.collection(`rooms/${name}/chats`).orderBy("timeStamp", "asc").onSnapshot(data => {
        setMessages({ name: name, messages: data.docs })
      })
    } catch({ message }) {
      alert(message)
    }
  }

  const signIn = async () => {
    setLoading(true)

    try {
      await auth.signInWithPopup(new GoogleProvider())  
      setLoading(false)
    } catch ({ message }) {
      alert(message)  
      setLoading(false)
    }
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Navbar 
          currentUser={currentUser}
          loading={loading}
          room={messages && true}
          currentMessage={currentMessage}
          name={messages?.name}
          setCurrentMessage={setCurrentMessage}
        />
        {
          loading ? <LoadingBar className="center" /> : (
            currentUser ? (
              <Switch>
                <Route path="/" exact>
                  <div className="main-container">
                    <RoomListContainer rooms={rooms} getMessages={getMessages} />
                    {messages && <MessageContainer messages={messages.messages} name={messages.name} setCurrentMessage={setCurrentMessage} />}
                  </div>
                </Route>

                <Route path="/profile" exact>
                  <Profile currentUser={currentUser} />
                </Route>

                {
                  messages && (
                    <Route path="/room/settings" exact>
                      <RoomSettings rooms={rooms} roomName={messages.name} setMessages={setMessages} />
                    </Route>
                  )
                }
                
                <Route path="/:wrongURL">
                  <NotFound />
                </Route>
              </Switch>
            ) : (
              <Switch>
                <Route path="/" exact>
                  <div className="center">
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={() => signIn()}
                    >
                      Sign in via Google
                    </Button>
                  </div>
                </Route>

                <Route path="/:wrongURL">
                  <NotFound />
                </Route>
              </Switch>
            ) 
          )
        }
      </ThemeProvider>
    </Router>
  );
}

export default App;
