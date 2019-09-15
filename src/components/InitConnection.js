import React, { Component } from 'react'
import {Button, Input, Form, InputGroup, InputGroupAddon} from 'reactstrap';

class InitConnection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            connectedUserId: '',
            readyToConnect: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;

        this.setState({
            [target.name]: target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault()

        if (this.state.userName.trim()) {
            this.props.saveUserName(this.state.userName)
            this.setState({
                readyToConnect: true
            });
        }

        if (this.state.readyToConnect && this.state.connectedUserId.trim()) {
            this.props.connect(this.state.connectedUserId)
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={ this.handleSubmit }>
                    <InputGroup>
                        { !this.state.readyToConnect && (
                            <Input
                                name="userName"
                                value={ this.state.userName }
                                onChange={ this.handleChange }
                                placeholder="Your nickname"
                            />
                        ) }
                        { this.state.readyToConnect && (
                            <Input
                                name="connectedUserId"
                                value={ this.state.connectedUserId }
                                onChange={ this.handleChange }
                                placeholder="ChatID to connect"
                            />
                        ) }
                        <InputGroupAddon addonType="append">
                            <Button color={ this.state.readyToConnect ? 'primary' : 'success' }>
                                { this.state.readyToConnect ? 'Connect' : 'Create chat' }
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
            </div>
        )
    }
}

export default InitConnection