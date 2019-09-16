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
        this.ws = new WebSocket('ws://ec2-35-167-72-75.us-west-2.compute.amazonaws.com:9090') // TODO: move to config
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
        this.rtcConnection = new RTCPeerConnection({
            'iceServers': [{ 'url': 'stun:stun2.1.google.com:19302' }] // TODO: move to config
        })

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
            const receiveChannel = event.channel
            receiveChannel.onmessage = (event) => {
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
     * @param {object} offer
     * @param {string} userId
     * @param {string} connectedUserName
     */
    offer = (offer, userId, connectedUserName) => {
        this.connectedUserId = userId

        this.rtcConnection.setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => {
                return this.rtcConnection.createAnswer()
                    .then(answer => {
                        return this.rtcConnection.setLocalDescription(answer)
                            .then(() => {
                                this.sendToWs({
                                    type: 'answer',
                                    answer: answer,
                                    userName: this.userName // Send our name to connected user
                                })

                                // With offer we got name of user who wants to connect
                                this.dispatch(setConnectedUserId(userId))
                                this.dispatch(setConnectedUserName(connectedUserName))
                            })
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /**
     * @param {object} answer
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
     * @param {object} candidate
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
        this.dataChannel.send(message)
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
