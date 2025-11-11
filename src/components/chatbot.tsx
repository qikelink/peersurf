import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Send, X, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Smart PeerSurf Assistant. I can help you discover funding opportunities and provide Blockchain documentation assistance. What would you like to explore today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize Google Gemini AI (memoized to avoid re-initializing)
  const apiKey = "AIzaSyBKKgDl1L3m3gZNAB9pDfPjdI3Wxc3rzJA";
  const aiRef = useRef<GoogleGenAI | null>(null);
  
  useEffect(() => {
    if (apiKey && !aiRef.current) {
      aiRef.current = new GoogleGenAI({ apiKey });
    }
  }, [apiKey]);
  
  const ai = aiRef.current;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Add user message and make AI call
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      
      // Make AI call with the updated messages
      (async () => {
        try {
          let botResponseText: string;

          if (ai && apiKey) {
            // Use Gemini AI for dynamic responses
            botResponseText = await getAIBotResponse(userInput, updatedMessages);
          } else {
            // Fallback to hardcoded responses if API key is not configured
            botResponseText = getBotResponse(userInput);
          }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
            text: botResponseText,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(msgs => [...msgs, botResponse]);
          setIsTyping(false);
        } catch (error) {
          console.error('Error generating AI response:', error);
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: 'I apologize, but I\'m having trouble processing your request right now. Please try again or check if the API key is configured correctly.',
        isUser: false,
        timestamp: new Date()
      };
          setMessages(msgs => [...msgs, errorResponse]);
      setIsTyping(false);
        }
      })();
      
      return updatedMessages;
    });

    return; // Early return since AI call is async

  };

  const getAIBotResponse = async (userInput: string, conversationHistory: Message[]): Promise<string> => {
    if (!ai) {
      throw new Error('AI instance not initialized');
    }

    // Build conversation context for the AI
    const systemPrompt = `You are the Smart PeerSurf Assistant, a helpful AI assistant for the PeerSurf platform. Your role is to help users discover funding opportunities and provide Blockchain documentation assistance.

**About PeerSurf:**
- PeerSurf is a platform that connects creators and developers with funding opportunities
- The platform features Creator Grants (up to $10,000), Developer Bounties ($500-$5,000), Community Projects ($1,000-$25,000), and Research Fellowships ($15,000+)
- PeerSurf integrates with Blockchain, a decentralized video streaming network
- Users can delegate to Blockchain orchestrators and earn rewards (up to 65% APY)

**Your capabilities:**
1. Help users discover and understand funding opportunities (grants, bounties, fellowships)
2. Provide guidance on Blockchain technology, orchestrators, delegation, and API documentation
3. Explain application processes and requirements
4. Assist with account management and platform navigation
5. Answer general questions about the platform

**Important guidelines:**
- Be concise and helpful
- Use emojis sparingly and appropriately
- Format responses with clear structure (bullets, headers)
- If asked about something outside your scope, politely redirect to relevant features
- Maintain a friendly and professional tone
- Always focus on helping users navigate PeerSurf and understand Blockchain

Please respond naturally and helpfully to the user's query.`;

    // Build conversation history (last 10 messages for context)
    const recentMessages = conversationHistory.slice(-10);
    const conversationContext = recentMessages
      .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\n**Conversation History:**\n${conversationContext}\n\n**Current User Query:**\n${userInput}\n\n**Assistant Response:**`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      return response.text || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('AI API error:', error);
      throw error;
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Opportunity Discovery Responses
    if (input.includes('opportunity') || input.includes('funding') || input.includes('grant')) {
      return '🎯 **Funding Opportunities Available:**\n\n• **Creator Grants** - Up to $10,000 for content creators\n• **Developer Bounties** - $500-$5,000 for technical contributions\n• **Community Projects** - $1,000-$25,000 for community initiatives\n• **Research Fellowships** - $15,000+ for academic research\n\nBrowse all opportunities in the "Opportunities" section. Would you like help finding specific types of funding?';
    } else if (input.includes('blockchain') || input.includes('orchestrator') || input.includes('delegation')) {
      return '🔗 **Blockchain Documentation & Resources:**\n\n• **Getting Started** - Set up your Blockchain node\n• **Delegation Guide** - How to delegate to orchestrators\n• **API Documentation** - Technical implementation guides\n• **Community Forum** - Connect with other developers\n• **Tutorials** - Step-by-step video guides\n\nI can help you find specific documentation or answer technical questions about Blockchain integration.';
    } else if (input.includes('earn') || input.includes('apy') || input.includes('rewards')) {
      return '💰 **Earning Opportunities:**\n\n• **Delegation Rewards** - Earn up to 65% APY by delegating to orchestrators\n• **Content Creation** - Monetize your video content\n• **Technical Contributions** - Earn through developer bounties\n• **Community Building** - Get rewarded for community engagement\n\nWould you like to learn more about any specific earning method?';
    } else if (input.includes('sponsor') || input.includes('sponsorship') || input.includes('create opportunity')) {
      return '🏢 **Become a Sponsor:**\n\n• **Create Opportunities** - Post funding opportunities for creators\n• **Set Requirements** - Define criteria and application process\n• **Manage Applications** - Review and select recipients\n• **Track Impact** - Monitor the success of your funding\n\nAccess the Sponsor Dashboard to start creating opportunities. Need help with the process?';
    } else if (input.includes('profile') || input.includes('account') || input.includes('settings')) {
      return '👤 **Profile Management:**\n\n• **Update Information** - Keep your profile current\n• **Portfolio Showcase** - Display your work and achievements\n• **Application History** - Track your funding applications\n• **Notifications** - Stay updated on new opportunities\n\nManage your account in the Profile section. Make sure you\'re logged in to access these features.';
    } else if (input.includes('help') || input.includes('what can you do')) {
      return '🤖 **I can help you with:**\n\n**🎯 Opportunity Discovery:**\n• Find relevant funding opportunities\n• Explain application requirements\n• Track application status\n\n**📚 Blockchain Documentation:**\n• Technical implementation guides\n• API documentation\n• Community resources\n\n**💡 General Assistance:**\n• Account management\n• Platform navigation\n• Feature explanations\n\nWhat specific area would you like to explore?';
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! 👋 I\'m your Smart PeerSurf Assistant specializing in opportunity discovery and Blockchain documentation. I can help you find funding opportunities, understand Blockchain technology, and navigate the platform. What would you like to explore today?';
    } else if (input.includes('documentation') || input.includes('docs') || input.includes('guide')) {
      return '📖 **Blockchain Documentation Resources:**\n\n• **Quick Start Guide** - Get up and running in minutes\n• **API Reference** - Complete technical documentation\n• **SDK Documentation** - Integration guides for developers\n• **Video Tutorials** - Step-by-step visual guides\n• **Community Examples** - Real-world implementation samples\n\nI can help you find specific documentation or explain technical concepts. What are you looking to build?';
    } else if (input.includes('application') || input.includes('apply') || input.includes('submit')) {
      return '📝 **Application Process:**\n\n• **Browse Opportunities** - Find funding that matches your skills\n• **Review Requirements** - Check eligibility and criteria\n• **Prepare Materials** - Gather portfolio, proposals, etc.\n• **Submit Application** - Complete the application form\n• **Track Status** - Monitor your application progress\n\nNeed help with a specific application or have questions about requirements?';
    } else {
      return 'Thanks for your message! I\'m here to help you discover funding opportunities and provide Blockchain documentation assistance. You can ask me about:\n\n• Finding relevant opportunities\n• Understanding Blockchain technology\n• Application processes\n• Technical implementation\n• Platform features\n\nWhat would you like to explore?';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={toggleChatbot}
        className={`fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
        }`}
        size="icon"
        style={!isOpen ? {
          background: 'linear-gradient(135deg, #3366FF 0%, #ECF3FF 100%)',
          color: 'white'
        } : {}}
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className={`fixed bottom-20 right-2 sm:right-4 z-40 w-[calc(100vw-1rem)]  sm:w-80 md:w-96 max-h-[calc(100vh-8rem)] flex flex-col shadow-2xl border ${isDark ? 'border-gray-800' : 'border-gray-300'} rounded-2xl transition-all duration-300 chatbot-window overflow-hidden p-0 gap-0 ${
          isMinimized ? 'h-12' : 'h-80 sm:h-96'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} bg-gradient-to-r from-[#3366FF] to-[#101B44] text-white rounded-t-2xl flex-shrink-0`}>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Smart Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={toggleMinimize}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className={`flex-1 overflow-y-auto p-3 space-y-3 min-h-0 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} backdrop-blur-sm chatbot-messages`}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#3366FF] to-[#101B44] text-white'
                          : isDark 
                            ? 'bg-gray-800/50 backdrop-blur-sm text-white border border-gray-700'
                            : 'bg-white backdrop-blur-sm text-gray-900 border border-gray-300'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-[#ECF3FF]' : isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} backdrop-blur-sm border rounded-xl px-3 py-2`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#3366FF] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#3366FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#3366FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-2 sm:p-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'} ${isDark ? 'bg-gray-900/50' : 'bg-gray-100/50'} backdrop-blur-sm rounded-b-2xl flex-shrink-0`}>
                <div className="flex gap-1 sm:gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about opportunities or Blockchain docs..."
                    className={`flex-1 text-sm min-w-0 ${isDark 
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                    } focus:border-[#3366FF] focus:ring-[#3366FF]/20`}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="px-2 sm:px-3 flex-shrink-0 bg-gradient-to-r from-[#3366FF] to-[#101B44] hover:from-[#2952CC] hover:to-[#1F3FA3] text-white border-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default Chatbot;
