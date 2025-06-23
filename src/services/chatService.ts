
import { ChatMessage } from '@/types/ChatMessage';

export class ChatService {
  private static instance: ChatService;
  private messages: Map<string, ChatMessage[]> = new Map();
  private listeners: Map<string, ((messages: ChatMessage[]) => void)[]> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  subscribeToMessages(courseId: string, callback: (messages: ChatMessage[]) => void): () => void {
    if (!this.listeners.has(courseId)) {
      this.listeners.set(courseId, []);
    }
    
    this.listeners.get(courseId)!.push(callback);
    
    // Send current messages immediately
    const currentMessages = this.messages.get(courseId) || [];
    callback(currentMessages);
    
    // Return unsubscribe function
    return () => {
      const courseListeners = this.listeners.get(courseId);
      if (courseListeners) {
        const index = courseListeners.indexOf(callback);
        if (index > -1) {
          courseListeners.splice(index, 1);
        }
      }
    };
  }

  async sendMessage(courseId: string, text: string, sender: string): Promise<void> {
    try {
      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender,
        text,
        timestamp: new Date(),
        courseId
      };

      // Add message to local storage
      if (!this.messages.has(courseId)) {
        this.messages.set(courseId, []);
      }
      
      this.messages.get(courseId)!.push(message);
      
      // Notify all listeners
      const listeners = this.listeners.get(courseId) || [];
      const allMessages = this.messages.get(courseId) || [];
      
      listeners.forEach(callback => callback([...allMessages]));
      
      console.log(`Message sent to course ${courseId}:`, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  }

  getMessages(courseId: string): ChatMessage[] {
    return this.messages.get(courseId) || [];
  }
}
