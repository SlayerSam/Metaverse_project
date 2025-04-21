import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, MessageCircle } from 'lucide-react'
import { getMessages, getSocket, sendMessage } from './WebSocketClient'
import { useSelector } from 'react-redux'

const getColorFromName = (name) => {
    const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFC75F', '#A66DD4', '#FF9671']
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

export default function ChatRoom() {
    const { user } = useSelector((state) => state.user)
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [open, setOpen] = useState(true)

    const getMessagesAndUsers = async () => {
        try {
            const messagesArr = await getMessages(user.roomId)
            // Set messages
            setMessages(messagesArr?.messages || [])

            // Extract unique users
            const uniqueUsers = Array.from(
                new Set(messagesArr?.messages?.map((msg) => msg.username))
            )

            setUsers(uniqueUsers || [])
        } catch (error) {
            console.error('Failed to get messages and users:', error)
        }
    }

    useEffect(() => {
        const socket = getSocket();
        socket.on('sendRoomMessage', ({ data }) => {
            setMessages([...messages, { user: data.username, text: data.message }])
            if (!users.includes(data.username)) {
                setUsers((state) => [
                    ...state,
                    data.username
                ])
            }
        })
    }, [])

    useEffect(() => {
        if (user?.authenticated)
            getMessagesAndUsers()
    }, [input, user])

    const handleSend = async () => {
        if (!input.trim()) return
        const response = await sendMessage(user.id, user.roomId, input.slice(0, 100))
        setMessages([...messages, { user: user.name, text: input.slice(0, 100) }])
        setInput('')
    }

    return (
        <div className="fixed bottom-0 right-0 z-30 w-full max-w-lg">
            <div className="flex justify-end pr-2 pb-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(!open)}
                    className="hover:bg-gray-500 border-2 bg-black"
                >
                    {open ? <ChevronDown size={20} /> : <MessageCircle size={20} />}
                </Button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white space-y-4 rounded-t-xl shadow-2xl dark:bg-zinc-900"
                    >
                        <Card className="rounded-t-xl">
                            <CardContent className="p-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-1/4 space-y-2 border-r pr-2">
                                        <h2 className="text-lg font-semibold mb-2">Users</h2>
                                        {users.map((user) => (
                                            <div key={user} className="text-sm font-medium" style={{ color: getColorFromName(user) }}>
                                                {user}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-3/4 space-y-2">
                                        <h2 className="text-lg font-semibold mb-2">Chat</h2>
                                        <div className="h-64 overflow-y-auto space-y-2">
                                            {messages?.map((msg, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
                                                >
                                                    <span className="font-semibold" style={{ color: getColorFromName(msg.user) }}>
                                                        {msg?.username}:
                                                    </span>{' '}
                                                    <span className="text-sm">{msg?.message}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <Input
                                                className="flex-1"
                                                placeholder="Type a message (max 100 chars)..."
                                                value={input}
                                                maxLength={100}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            />
                                            <Button onClick={handleSend}>Send</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
