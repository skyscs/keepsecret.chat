import React from 'react'
import PropTypes from 'prop-types'
import {Button, Card, CardBody, CardHeader, CardText} from "reactstrap";

const Invitation = ({ chatOwner, connectedUserName }) => {
    return (
        <div>
            { !chatOwner && (
                <Card>
                    <CardHeader><strong>{ connectedUserName }</strong> wants to join</CardHeader>
                    <CardBody>
                        <CardText>You can accept or reject him</CardText>
                        <Button color="success" className="mr-2">Accept</Button>
                        <Button color="error" >Reject</Button>
                    </CardBody>
                </Card>
            ) }
            { chatOwner && (
                <Card>
                    <CardHeader>You are connecting to <strong>{ connectedUserName }</strong>...</CardHeader>
                    <CardBody>
                        <CardText>You need to be approved to join his chat</CardText>
                    </CardBody>
                </Card>
            ) }
        </div>
    )
}

Invitation.propTypes = {
    connectedUserName: PropTypes.string.isRequired
}

export default Invitation
