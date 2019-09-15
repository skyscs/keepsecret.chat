const shortid = require('shortid');
const WebSocketServer = require('ws').Server;
const curry = require('lodash.curry');

const wss = new WebSocketServer({port: 9090});
const users = {};

sendTo = (connection, message) => {
    connection.send(JSON.stringify(message));
}

wss.on('connection', connection => {
    console.log('User connected');

    connection.on('message', message => {
        console.log('onMessage: ', message);

        let sendError = curry((connection, type) => {
            sendTo(connection, {
                type,
                success: false
            })
        })(connection);

        try {
            message = JSON.parse(message);
        } catch (e) {
            message = {};
        }

        switch (message.type) {
            case 'login':
                const userId = shortid.generate();
                console.log('User logged', userId);

                if (users[userId] !== undefined) {
                    sendError('login')
                }

                // save user connection on the server
                users[userId] = connection;
                connection.userId = userId;

                sendTo(connection, {
                    type: 'login',
                    success: true,
                    userId
                });

                break;

            case 'offer':
                console.log('Sending offer to: ', message.userId);
                console.log('users[message.userId]: ', users[message.userId]);

                if (users[message.userId] !== undefined) {
                    connection.connectedUserId = message.userId;

                    sendTo(users[message.userId], {
                        type: 'offer',
                        offer: message.offer,
                        userId: connection.userId,
                        userName: message.userName
                    });

                    break;
                }

                console.log('send error');
                sendError('offer');
                break;

            case 'answer':
                console.log('Sending answer to: ', message.userId);

                if (users[message.userId] !== undefined) {
                    connection.connectedUserId = message.userId;
                    sendTo(users[message.userId], {
                        type: 'answer',
                        answer: message.answer,
                        userId: message.userId,
                        userName: message.userName
                    });
                }

                break;

            case 'candidate':
                console.log('Sending candidate to:', message.userId);

                if (users[message.userId] !== undefined) {
                    sendTo(users[message.userId], {
                        type: 'candidate',
                        candidate: message.candidate
                    });
                }

                break;

            case 'accept':
                if (users[message.userId] !== undefined) {
                    sendTo(users[message.userId], {
                        type: 'accept'
                    });
                }

                break;

            case 'reject':
                if (users[message.userId] !== undefined) {
                    sendTo(users[message.userId], {
                        type: 'reject'
                    });
                }

                break;

            case 'leave':
                console.log('Disconnecting from', message.userId);

                // notify the other user so he can disconnect his peer connection
                if (users[message.userId] !== undefined) {
                    const targetConnection = users[message.userId];
                    targetConnection.connectedUserId = null;

                    sendTo(targetConnection, {
                        type: 'leave'
                    });
                }

                break;

            default:
                sendTo(connection, {
                    type: 'error',
                    message: 'Command not found: ' + message.type
                });

                break;
        }
    });

    connection.on('close', function() {
        if (connection.userId) {
            delete users[connection.userId];

            if (connection.connectedUserId) {
                console.log('Disconnecting from ', connection.connectedUserId);

                if (users[connection.connectedUserId] !== undefined) {
                    const targetConnection = users[connection.connectedUserId];
                    targetConnection.connectedUserId = null;

                    sendTo(targetConnection, {
                        type: 'leave'
                    });
                }
            }
        }
    });
});
