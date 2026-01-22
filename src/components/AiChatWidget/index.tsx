import { getAiChatSetting } from "../../services/auth";
import { useState, useEffect, useRef } from "react";
import { getUserId } from "../../services/auth";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const AiChatWidget = () => {
    const [aiChatEnabled, setAiChatEnabled] = useState(false);
    const [userID, setUserID] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Merhaba',
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Hızlı eylemler
    const quickActions = [
        "Makine durumları nedir?",
        "Yakıt tüketimi raporu",
        "Bakım gerekli makineler"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getUserId();
            setUserID(id);

            if (id) {
                const aiChatSetting = await getAiChatSetting(id);
                if (aiChatSetting !== null) {
                    setAiChatEnabled(aiChatSetting);
                }
            }
        };
        fetchUserId();
    }, []);

    const handleSendMessage = async (customText?: string) => {
        const messageText = customText || inputValue;
        if (!messageText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simüle edilmiş AI yanıtı (gerçek API ile değiştirilecek)
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Bu bir demo yanıtıdır',
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!userID || !aiChatEnabled) return null;

    return (
        <div className="w-full bg-white mt-4 dark:bg-gray10 rounded-[10px] shadow-[2px_2px_4px_#00000026] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-mstYellow from-mstYellow to-yellow-500 p-3 flex items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                    
                    <div>
                        <h3 className="text-white font-semibold text-lg text-center">AI Asistan</h3>
                        
                    </div>
                </div>
                
            </div>

            {/* Messages Area */}
            <div className="h-[400px] overflow-y-auto p-3 space-y-3 bg-gray1 dark:bg-gray-900">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    >
                        <div
                            className={`max-w-[80%] rounded-xl px-3 py-2 ${
                                message.isUser
                                    ? 'bg-mstYellow text-white rounded-br-sm'
                                    : 'bg-white dark:bg-gray10 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                            } shadow-sm`}
                        >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <p className={`text-[10px] mt-1 ${
                                message.isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                {message.timestamp.toLocaleTimeString('tr-TR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start animate-fadeIn">
                        <div className="bg-white dark:bg-gray10 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray10 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-2">
                    <div className="flex-1 relative">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Mesajınızı yazın..."
                            rows={2}
                            className="w-full px-3 py-2 bg-gray1 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-mstYellow focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                            style={{ maxHeight: '80px' }}
                        />
                    </div>
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim()}
                        className={`p-2.5 rounded-lg transition-all ${
                            inputValue.trim()
                                ? 'bg-mstYellow hover:bg-yellow-600 text-white shadow-md'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default AiChatWidget;
