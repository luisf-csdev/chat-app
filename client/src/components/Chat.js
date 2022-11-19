import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                sender: username,
                message: currentMessage,
                time:
                    (
                        new Date(Date.now()).getHours() < 10 ?
                            '0' + new Date(Date.now()).getHours() :
                            new Date(Date.now()).getHours()
                    )
                    + ':' +
                    (
                        new Date(Date.now()).getMinutes() < 10 ?
                            '0' + new Date(Date.now()).getMinutes() :
                            new Date(Date.now()).getMinutes()
                    )
            }
            await socket.emit('send_message', messageData);
            setMessageList((messages) => [...messages, messageData]);
            setCurrentMessage('');
        }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList((messages) => [...messages, data])
        })
    }, [socket])

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>{room}</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                    {messageList.map((messageContent) => {
                        return (
                            <div className='message' id={username === messageContent.sender ? 'you' : 'other'}>
                                <div>
                                    <div className='message-content'>
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className='message-meta'>
                                        {username === messageContent.sender ?
                                            <><p id='time'>{messageContent.time}</p><p id='sender'>{messageContent.sender}</p></>
                                            :
                                            <><p id='sender'>{messageContent.sender}</p><p id='time'>{messageContent.time}</p></>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input type='text' placeholder='Write your message...' value={currentMessage}
                    autoFocus onChange={(event) => {
                        setCurrentMessage(event.target.value)
                    }}
                    onKeyPress={(event) => { event.key === 'Enter' && sendMessage() }}
                />
                <button onClick={sendMessage} />
            </div>
        </div>
    )
}

export default Chat
