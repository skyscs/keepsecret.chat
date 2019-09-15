const defaultState = {
    userId: '',
    userName: '',
    connectedUserId: '',
    connectedUserName: '',
    connectionEstablished: false,
    chatOwner: false,
    messages: []
}

export default function rootReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_USER_ID':
            return Object.assign({}, state, {
                userId: action.userId
            })
        case 'SET_USER_NAME':
            return Object.assign({}, state, {
                userName: action.userName
            })
        case 'SET_CONNECTED_USER_ID':
            return Object.assign({}, state, {
                connectedUserId: action.userId
            })
        case 'SET_CONNECTED_USER_NAME':
            return Object.assign({}, state, {
                connectedUserName: action.userName
            })
        case 'SET_CONNECTION_STATUS':
            return Object.assign({}, state, {
                connectionEstablished: action.status
            })
        case 'SET_CHAT_OWNER':
            return Object.assign({}, state, {
                chatOwner: action.status
            })
        case 'ADD_MESSAGE':
            return Object.assign({}, state, {
                messages: [
                    ...state.messages,
                    {
                        id: action.id,
                        text: action.text,
                        own: action.own,
                        created: action.created
                    }
                ]
            })
        case 'REMOVE_MESSAGE':
            return Object.assign({}, state, {
                messages: [
                    ...state.messages.filter(item => item.id !== action.id),
                ]
            })
        default:
            return state
    }
}