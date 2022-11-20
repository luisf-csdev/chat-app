import './App.css';
import io from 'socket.io-client'
import { useState } from 'react'
import Chat from './components/Chat';

const ENDPOINT = 'https://chat-rooms-server.fly.dev/'
const socket = io.connect(ENDPOINT);


function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room)
      setShowChat(true);
    }
  }

  return (
    <div className="container">
      {!showChat ?
        <div className='join-container'>
          <h3>Chat Rooms</h3>
          <input type='text' placeholder='Username' maxLength={16} onChange={(event) => {
            setUsername(event.target.value);
          }}
            onKeyPress={(event) => { event.key === 'Enter' && joinRoom() }}
          />
          <input type='text' placeholder='#Room' maxLength={16} onChange={(event) => {
            setRoom(event.target.value);
          }}
            onKeyPress={(event) => { event.key === 'Enter' && joinRoom() }}
          />
          <button onClick={joinRoom}>JOIN</button>
        </div>
        :
        <Chat socket={socket} username={username} room={room} />
      }
    </div>

  );
}

export default App;
