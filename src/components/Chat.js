import React from 'react'
import PropTypes from 'prop-types'
import Message from './Message'

const Chat = ({ messages }) => {
    return (
        <div className='flex-fill overflow-auto border rounded mb-2'>
            {messages.map(message =>
                <Message
                    key={message.id}
                    {...message}
                />
            )}
        </div>
    )
}

Chat.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired
    }).isRequired).isRequired,
}

export default Chat
