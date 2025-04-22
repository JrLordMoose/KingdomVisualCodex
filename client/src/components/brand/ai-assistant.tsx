import { useState } from "react";
import { X, Zap, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function AIAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI brand assistant. How can I help with your brand style guide today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();
  
  const aiMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/ai/message", { message });
      return await res.json();
    },
    onSuccess: (data) => {
      addMessage('assistant', data.message);
    },
    onError: (error: Error) => {
      toast({
        title: "AI Error",
        description: error.message || "Failed to get a response from the assistant.",
        variant: "destructive",
      });
      
      addMessage('assistant', "Sorry, I couldn't process that request. Please try again later.");
    },
  });
  
  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    addMessage('user', userMessage);
    aiMessageMutation.mutate(userMessage);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-8 right-8 z-20">
      <div className="bg-sidebar-bg border border-dark-gray rounded-lg shadow-lg w-80 overflow-hidden">
        <div className="bg-ai-accent px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-white" />
            <h3 className="font-secondary text-white ml-2">AI Assistant</h3>
          </div>
          <button className="text-white hover:text-gray-200" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 h-64 overflow-y-auto flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[85%] ${
                message.role === 'assistant'
                  ? 'bg-sidebar-hover self-start'
                  : 'bg-ai-accent self-end'
              }`}
            >
              <p className="text-white text-sm">{message.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
          {aiMessageMutation.isPending && (
            <div className="bg-sidebar-hover self-start p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-light-gray rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-light-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-light-gray rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-dark-gray p-3">
          <div className="flex">
            <Input
              type="text"
              placeholder="Ask anything about your brand..."
              className="flex-1 bg-sidebar-hover border-dark-gray rounded-r-none text-white focus:border-ai-accent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={aiMessageMutation.isPending}
            />
            <Button
              className="bg-ai-accent hover:bg-opacity-80 text-white rounded-l-none"
              onClick={handleSendMessage}
              disabled={aiMessageMutation.isPending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
