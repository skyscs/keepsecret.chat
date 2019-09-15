import { connect } from "react-redux"
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardText } from 'reactstrap'
import { removeMessage } from "../actions"

const secondsToRemove = 60;

class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            seconds: secondsToRemove
        }
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

        if (createdDateInSeconds + secondsToRemove < currentDateInSeconds) {
            dispatch(removeMessage(id))
            clearInterval(this.timerID)
        }
    }

    render = () => {
        const { text, own } = this.props
        return (
            <div className='clearfix mb-2 mt-2 mr-2 ml-2'>
                <Card className={own ? 'float-right' : 'float-left'}>
                    <CardBody>
                        <CardText>{ text }</CardText>
                        <CardText>
                            <small className="text-muted">Will be removed in { this.state.seconds } sec</small>
                        </CardText>
                    </CardBody>
                </Card>
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