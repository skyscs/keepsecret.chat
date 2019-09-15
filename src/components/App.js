import { connect } from 'react-redux'
import React, { Component } from 'react'
import Chat from './Chat'
import AddMessage from './AddMessage'
import WebRTC from '../services/WebRTC'
import InitConnection from "./InitConnection"
import { Row, Col, Button, Badge } from 'reactstrap';
import Octicon, { Clippy } from '@primer/octicons-react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Invitation from "./Invitation";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rtc: null
        }
    }

    componentDidMount = () => {
        const { dispatch } = this.props
        this.setState({
            rtc: new WebRTC(dispatch)
        })
    }

    render = () => {
        const {
            userId,
            userName,
            connectedUserId,
            connectedUserName,
            connectionEstablished,
            chatOwner,
            messages
        } = this.props

        return (
            <Row className='h-100'>
                <Col sm="12" md={{ size: 8, offset: 2 }} className='d-flex h-100 flex-column'>
                    <Row>
                        <Col>
                            <h1>KeepSecret.chat</h1>
                        </Col>
                        <Col>
                            { !connectedUserId && userName && (
                                <CopyToClipboard text={ userId }>
                                    <Button color="primary" outline className='float-right mt-2'>
                                        Hello <strong>{ userName }</strong>, your ChatID is
                                        <Badge color="secondary" className="ml-2">{ userId }</Badge>
                                        <Octicon icon={ Clippy } className='mb-1 ml-2' />
                                    </Button>
                                </CopyToClipboard>
                            ) }
                            { connectedUserId && (
                                <Button color="success" outline className='float-right mt-2'>
                                    User <strong>{ connectedUserName }</strong> is connected
                                </Button>
                            )}
                        </Col>
                    </Row>
                    {!connectedUserId && this.state.rtc && (
                        <InitConnection
                            connect={ this.state.rtc.connect.bind(this.state.rtc) }
                            saveUserName={ this.state.rtc.saveUserName.bind(this.state.rtc) }
                        />
                    )}
                    {connectedUserId && !connectionEstablished && (
                        <Invitation chatOwner={chatOwner} connectedUserName={connectedUserName} />
                    )}
                    {connectedUserId && connectionEstablished && this.state.rtc && (
                        <Chat messages={messages} />
                    )}
                    {connectedUserId && connectionEstablished && this.state.rtc && (
                        <AddMessage sendMessage={ this.state.rtc.sendMessageToChannel.bind(this.state.rtc) } />
                    )}
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => {
    const { userId, userName, connectedUserId, connectedUserName, connectionEstablished, chatOwner, messages } = state
    return {
        userId,
        userName,
        connectedUserId,
        connectedUserName,
        connectionEstablished,
        chatOwner,
        messages
    }
}

export default connect(
    mapStateToProps
)(App)
