import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class Chat extends Component {
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        const { messages } = this.props
        return (
            <div className='flex-fill overflow-auto border rounded mb-2'>
                <TransitionGroup>
                    {messages.map(message =>
                        <CSSTransition
                            key={message.id}
                            timeout={500}
                            classNames="message"
                        >
                            <Message
                                key={message.id}
                                {...message}
                            />
                        </CSSTransition>
                    )}
                </TransitionGroup>
                <div ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>
        )
    }
}

Chat.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired
    }).isRequired).isRequired,
}

export default Chat
