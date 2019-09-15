let nextMessageId = 0
export const addMessage = (text, own) => ({
    type: 'ADD_MESSAGE',
    id: nextMessageId++,
    text,
    own,
    created: new Date().getTime()
})

export const removeMessage = (id) => ({
    type: 'REMOVE_MESSAGE',
    id
})

export const setUserId = (userId) => ({
    type: 'SET_USER_ID',
    userId
})

export const setUserName = (userName) => ({
    type: 'SET_USER_NAME',
    userName
})

export const setConnectedUserId = (userId) => ({
    type: 'SET_CONNECTED_USER_ID',
    userId
})

export const setConnectionStatus = (status) => ({
    type: 'SET_CONNECTION_STATUS',
    status
})

export const setChatOwner = (status) => ({
    type: 'SET_CHAT_OWNER',
    status
})

export const setConnectedUserName = (userName) => ({
    type: 'SET_CONNECTED_USER_NAME',
    userName
})
