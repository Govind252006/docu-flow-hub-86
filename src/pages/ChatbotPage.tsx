import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, FileText, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  documents?: any[];
}

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I can help you find documents and information. Try asking me about specific topics, departments, or document types.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchDocuments = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,department.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses (in a real app, you'd use AI)
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you find documents and information. What are you looking for?";
    }
    
    if (lowerMessage.includes('help')) {
      return "I can help you with:\n• Finding documents by keywords\n• Searching by department\n• Locating specific document types\n• Getting document summaries\n\nJust describe what you're looking for!";
    }

    if (lowerMessage.includes('department') || lowerMessage.includes('engineering') || 
        lowerMessage.includes('operations') || lowerMessage.includes('hr') ||
        lowerMessage.includes('compliance') || lowerMessage.includes('procurement') || 
        lowerMessage.includes('safety')) {
      
      const documents = await searchDocuments(userMessage);
      
      if (documents.length > 0) {
        let response = `I found ${documents.length} document(s) related to your query:\n\n`;
        documents.slice(0, 5).forEach((doc, index) => {
          response += `${index + 1}. **${doc.title}**\n   Department: ${doc.department}\n   Status: ${doc.status}\n\n`;
        });
        return response;
      } else {
        return "I couldn't find any documents matching your query. Try searching with different keywords or check with your department manager.";
      }
    }

    // Default response for general queries
    const documents = await searchDocuments(userMessage);
    
    if (documents.length > 0) {
      let response = `I found ${documents.length} document(s) that might be relevant:\n\n`;
      documents.slice(0, 3).forEach((doc, index) => {
        response += `${index + 1}. **${doc.title}**\n   Department: ${doc.department}\n   Priority: Level ${doc.priority}\n\n`;
      });
      return response;
    }

    return "I understand you're looking for information, but I couldn't find specific documents matching your query. Could you try being more specific about the department, document type, or keywords?";
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const botResponse = await generateBotResponse(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQueries = [
    "Show me engineering documents",
    "Find safety compliance reports", 
    "What are the latest HR policies?",
    "Search for procurement documents"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto h-[calc(100vh-3rem)]">
        <Card className="h-full flex flex-col shadow-elegant">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Document Assistant
                </h1>
                <p className="text-white/80">
                  Ask me anything about your documents and files
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-primary text-white'
                          : 'bg-accent/20 border border-border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-accent/20 border border-border rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-accent/20 border border-border px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Suggested Queries */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-border bg-accent/5">
                <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInput(query);
                        handleSendMessage();
                      }}
                      className="text-xs"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about documents, departments, or specific topics..."
                  className="flex-1 h-12"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  variant="hero"
                  size="lg"
                  className="px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;