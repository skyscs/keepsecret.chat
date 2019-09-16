import {
    addMessage,
    setUserId,
    setConnectedUserId,
    setConnectedUserName,
    setUserName,
    setChatOwner,
    setConnectionStatus
} from '../actions'

/**
 * @class WebRTC
 * @property {function} dispatch
 * @property {object} ws
 * @property {object} rtcConnection
 * @property {object} dataChannel
 * @property {string} connectedUserId
 * @property {string} userName
 */
class WebRTC {
    dispatch
    ws
    rtcConnection
    dataChannel
    receiveChannel
    connectedUserId
    userName

    /**
     * @param {function} dispatch
     */
    constructor(dispatch) {
        this.dispatch = dispatch

        this.init()
    }

    /**
     * Init WebSocket connection and listeners
     */
    init = () => {
        this.ws = new WebSocket('wss://ws.wekeepsecret.com:5000') // TODO: move to config
        this.ws.onopen = () => {
            this.sendToWs({
                type: 'login'
            })
        }

        this.ws.onmessage = (message) => {
            message = JSON.parse(message.data)

            if (message.success === false) {
                this.procBadResponse(message.type)
                return
            }

            switch(message.type) {
                case 'login':
                    this.login(message.userId)
                    break

                case 'offer':
                    this.offer(
                        message.offer,
                        message.userId,
                        message.userName
                    )
                    break

                case 'answer':
                    this.answer(
                        message.answer,
                        message.userId,
                        message.userName
                    )
                    break

                case 'candidate':
                    this.candidate(message.candidate)
                    break

                case 'accept':
                    this.accept()
                    break

                case 'reject':
                    this.reject()
                    break

                case 'leave':
                    this.leave()
                    break

                default:
                    break
            }
        }
    }

    /**
     * @param {string} userId
     */
    login = userId => {
        // TODO: Move to config
        const configuration = { iceServers: [{
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                    'stun:stun3.l.google.com:19302',
                    'stun:stun4.l.google.com:19302',
                ]
            }, {
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            },
            {
                url: 'turn:192.158.29.39:3478?transport=udp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            },
            {
                url: 'turn:192.158.29.39:3478?transport=tcp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            },
            {
                url: 'turn:turn.bistri.com:80',
                credential: 'homeo',
                username: 'homeo'
            },
            {
                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
            }]
        };
        this.rtcConnection = new RTCPeerConnection(configuration)

        this.rtcConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendToWs({
                    type: 'candidate',
                    candidate: event.candidate
                })
            }
        }

        this.dataChannel = this.rtcConnection.createDataChannel('c1')
        this.rtcConnection.ondatachannel = (event) => {
            this.receiveChannel = event.channel

            this.receiveChannel.onmessage = (event) => {
                this.dispatch(addMessage(event.data, false))
            }
        }

        this.dispatch(setUserId(userId))
    }

    /**
     * @param {string} userName
     */
    saveUserName = (userName) => {
        this.userName = userName
        this.dispatch(setUserName(userName))
    }

    /**
     * @param offer
     * @param {string} userId
     * @param {string} connectedUserName
     */
    offer = (offer, userId, connectedUserName) => {
        this.connectedUserId = userId
        let createdAnswer

        this.rtcConnection.setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => {
                return this.rtcConnection.createAnswer()
            })
            .then(answer => {
                createdAnswer = answer
                return this.rtcConnection.setLocalDescription(answer)
            })
            .then(() => {
                console.log('A', createdAnswer)

                this.sendToWs({
                    type: 'answer',
                    answer: createdAnswer,
                    userName: this.userName // Send our name to connected user
                })

                // With offer we got name of user who wants to connect
                this.dispatch(setConnectedUserId(userId))
                this.dispatch(setConnectedUserName(connectedUserName))
            })


            .catch((err) => {
                console.log(err)
            })
    }

    /**
     * @param answer
     * @param {string} userId
     * @param {string} userName
     */
    answer = (answer, userId, userName) => {
        this.rtcConnection.setRemoteDescription(new RTCSessionDescription(answer))
            .then(() => {

                // With answer we got name of user who wants to connect
                this.dispatch(setConnectedUserId(userId))
                this.dispatch(setConnectedUserName(userName))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /**
     * @param candidate
     */
    candidate = candidate => {
        this.rtcConnection.addIceCandidate(new RTCIceCandidate(candidate))
            .catch((err) => {
                console.log(err)
            })
    }

    leave = () => {
        this.connectedUserId = null
        this.rtcConnection.close()
        this.rtcConnection.onicecandidate = null
    }

    /**
     * @param {string} connectedUserId
     */
    connect = (connectedUserId) => {
        this.dispatch(setChatOwner(true))
        this.connectedUserId = connectedUserId

        this.rtcConnection.createOffer()
            .then(offer => {
                return this.rtcConnection.setLocalDescription(offer)
            })
            .then(() => {
                this.sendToWs({
                    type: 'offer',
                    offer: this.rtcConnection.localDescription,
                    userName: this.userName // Send our name to connected user
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    accept = () => {
        this.dispatch(setConnectionStatus(true))
    }

    reject = () => {
        this.dispatch(setConnectedUserId(''))
        this.dispatch(setConnectionStatus(false))
    }

    acceptConnection = () => {
        this.accept()
        this.sendToWs({
            type: 'accept',
            userId: this.connectedUserId
        })
    }

    rejectConnection = () => {
        this.reject()
        this.sendToWs({
            type: 'reject',
            userId: this.connectedUserId
        })
    }

    /**
     *
     * @param {string} type
     */
    procBadResponse = (type) => {
        console.log('Error', type);

        // TODO finish it
        switch (type) {
            case 'offer':
                break;
            case 'login':
                break;
            default:
                break;
        }
    }

    /**
     *
     * @param {string} message
     */
    sendMessageToChannel = message => {
        if (this.dataChannel.readyState === 'open') {
            this.dataChannel.send(message)
            this.dispatch(addMessage(message, true))
        }
    }

    /**
     *
     * @param {object} message
     */
    sendToWs = message => {
        if (this.connectedUserId) {
            message.userId = this.connectedUserId
        }

        this.ws.send(JSON.stringify(message))
    }
}

export default WebRTC
