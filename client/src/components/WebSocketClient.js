import { getContract } from '@/utils/contract';
import { compare, hashSync } from 'bcryptjs';
import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL, {
            transports: ['websocket'],
        });

        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });
    }
    return socket;
};

const emitEvent = (eventName, eventData) => {
    return new Promise((resolve, reject) => {
        const socket = getSocket();
        const requestId = Date.now() + Math.random();

        // Attach the requestId to event data
        const requestPayload = { ...eventData, requestId };

        // Listen for the specific response event
        const responseEvent = `${eventName}_response`;

        const handleResponse = (responseData) => {
            if (responseData.requestId === requestId) {
                socket.off(responseEvent, handleResponse); // Clean up the listener
                if (responseData.error) {
                    reject(responseData.error);
                } else {
                    resolve(responseData);
                }
            }
        };

        socket.on(responseEvent, handleResponse);

        // Emit the event with the unique requestId
        socket.emit(eventName, requestPayload);

        // Add a timeout to handle cases where no response is received
        setTimeout(() => {
            socket.off(responseEvent, handleResponse); // Clean up the listener
            reject('Timeout: No response received');
        }, 10000); // Adjust timeout as needed
    });
};

const NoReturnEmitEvent = (eventName, eventData) => {
    return new Promise((resolve, reject) => {
        try {

            const socket = getSocket();
            const requestId = Date.now() + Math.random();
            const requestPayload = { ...eventData, requestId };
            socket.emit(eventName, requestPayload);
            resolve()
        }
        catch (error) {
            console.error('No return emit event error:', error);
            reject(error)
        }
    });
}

export const reConnectUser = async (userId, roomId) => {
    try {
        await emitEvent('reconnectUser', { userId, roomId });
    } catch (error) {
        console.error('Reconnect user error:', error);
        return undefined;
    }
};

export const signup = async (userData, setIsLoading, setBtnText) => {
    try {
        setIsLoading(true);
        userData.password = hashSync(userData.password, 10);
        const { email, name, password } = userData;
        const contract = await getContract();
        const tx = await contract.registerUser(name, email, password);
        setBtnText('waiting for confirmation...')
        const receipt = await tx.wait(); // Wait for the transaction to be mined

        if (receipt.status === 1) {
            console.log('Transaction confirmed:', receipt);
            const response = await emitEvent('signup', { userData });
            setBtnText('Confirmed')
            setIsLoading(false); // Set loading state to false
            return { response, address: contract.getAddress(), err: '' };
        } else {
            console.error('Transaction failed:', receipt);
            setIsLoading(false); // Set loading state to false
            setBtnText('Continue')
            return { response: {}, err: 'Transaction failed' };
        }
    } catch (err) {
        console.error('Signup error:', err);
        return { response: {}, err: err };
    }
};

export const login = async (loginData) => {
    const { email, password } = loginData;
    try {
        const contract = await getContract();
        const user = await contract.getUserByEmail(email);
        if (user) {
            const valid = await compare(password, user.password);
            if (valid) {
                loginData.password = user.password;
                const response = await emitEvent('login', { userData: loginData });
                return { response, address: (await getContract()).getAddress(), err: '' };
            } else {
                return { user: {}, err: 'Password mismatch' };
            }
        }
        return { user: {}, err: 'User not found' };
    } catch (error) {
        console.error('Login error:', error);
        return { user: {}, err: error };
    }
};

export const createRoom = async () => {
    try {
        const response = await emitEvent('createRoom', {});
        return response.roomData;
    } catch (error) {
        console.error('Create room error:', error);
        throw error;
    }
};

export const fetchRoom = async (setRooms) => {
    try {
        const response = await emitEvent('fetchRooms', {});
        setRooms(response.rooms);
        return response.rooms;
    } catch (error) {
        console.error('Fetch room error:', error);
        throw error;
    }
};

export const fetchRoomById = async (roomId, setRoom) => {
    try {
        const response = await emitEvent('fetchRoomById', { roomId });
        setRoom(response.room);
        return response.room;
    } catch (error) {
        console.error('Fetch room by id error:', error);
        throw error;
    }
}

export const joinRoom = async (userId, roomId, setIsOpen) => {
    try {
        const response = await emitEvent('joinRoom', { userId, roomId });
        if (setIsOpen) setIsOpen(false);
        return response.rooms;
    } catch (error) {
        console.error('Join room error:', error);
        throw error;
    }
};

export const avatarStore = async (avatarData) => {
    try {
        const response = await emitEvent('avatarStore', { avatarData });
        return response.avatarId;
    } catch (error) {
        console.error('Avatar store error:', error);
        throw error;
    }
};

export const playerMovement = async (movementData) => {
    try {
        const response = await NoReturnEmitEvent('playerMovement', { movementData });
        return response;
    } catch (error) {
        console.error('Player movement error:', error);
        throw error;
    }
};

export const buyProduct = async (productId, price, quantity, setIsLoading, setBtnText) => {
    try {
        setIsLoading(true);
        setBtnText('Processing...');

        const contract = await getContract();
        const tx = await contract.buyProduct(productId, { value: price });
        setBtnText('Waiting for confirmation...');

        await tx.wait(); // Wait for the transaction to complete

        const response = await emitEvent('buyProduct', {
            productId,
            buyer: await contract.getAddress(),
            price,
            quantity
        });

        setBtnText('Purchase Successful');
        setIsLoading(false);
        return response;
    } catch (error) {
        console.error('Buy product error:', error);
        setIsLoading(false);
        setBtnText('Try Again');
        throw error;
    }
};

export const sendMessage = async (userId, roomId, message) => {
    try {
        const response = await NoReturnEmitEvent('sendRoomMessage', {
            userId, roomId, message
        });
        return response
    }
    catch (error) {
        console.error('Send message error in websocket client', error)
        throw error
    }
}

export const getMessages = async (roomId) => {
    try {

        const response = await emitEvent('getMessages', {
            roomId
        });
        console.log(response)

        return response;
    } catch (error) {
        console.error('Get messages error in websocket client:', error);
        throw error;
    }
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
