import { connect } from "react-redux"
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Progress, Toast, ToastBody, ToastHeader} from 'reactstrap'
import { removeMessage } from "../actions"

const secondsToRemove = parseInt(process.env.REACT_APP_SECONDS_TO_REMOVE_MESSAGE);

class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            seconds: secondsToRemove
        }
        console.log(secondsToRemove)
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {
        const { dispatch, id, created } = this.props

        const currentDateInSeconds = Math.floor(Date.now() / 1000)
        const createdDateInSeconds = Math.floor(created / 1000)

        this.setState({
            seconds: createdDateInSeconds + secondsToRemove - currentDateInSeconds
        })

        if (this.state.seconds <= 0) {
            dispatch(removeMessage(id))
            clearInterval(this.timerID)
        }
    }

    render = () => {
        const { text, own } = this.props
        return (
            <div className='clearfix mb-2 mt-2 mr-2 ml-2'>
                <Toast className={own ? 'float-right' : 'float-left'}>
                    <ToastBody>{ text }</ToastBody>
                    <Progress value={ this.state.seconds } max={ secondsToRemove } />
                </Toast>
            </div>
        )
    }
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    own: PropTypes.bool.isRequired,
    created: PropTypes.number.isRequired,
}

export default connect()(Message)