
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, User } from 'lucide-react';
import { ChatMessage } from '@/types/ChatMessage';

interface ChatViewProps {
  courseId: string;
  courseName: string;
  messages: ChatMessage[];
  onBack: () => void;
  onSendMessage: (text: string) => void;
  currentUser: string;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  courseId,
  courseName,
  messages, 
  onBack, 
  onSendMessage,
  currentUser 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {courseName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Class Chat</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start the conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to send a message in this class chat
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <Card 
                className={`max-w-xs lg:max-w-md p-3 ${
                  message.sender === currentUser 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {message.sender !== currentUser && (
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {message.sender}
                  </p>
                )}
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === currentUser 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-full"
          />
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
