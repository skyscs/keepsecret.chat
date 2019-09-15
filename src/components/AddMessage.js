import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addMessage } from '../actions'
import { Button, Input, InputGroup, InputGroupAddon, Form } from 'reactstrap';

class AddMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {message: ''}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({message: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault()
        const { dispatch, sendMessage } = this.props

        if (this.state.message.trim()) {
            sendMessage(this.state.message)
            dispatch(addMessage(this.state.message, true))
            this.setState({message: ''});
        }
    }

    render() {
        return (
            <div className='mt-2 mb-2'>
                <Form onSubmit={ this.handleSubmit }>
                    <InputGroup>
                        <Input value={ this.state.message } onChange={ this.handleChange } />
                        <InputGroupAddon addonType="append">
                            <Button color="primary">Send</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
            </div>
        )
    }
}

export default connect()(AddMessage)