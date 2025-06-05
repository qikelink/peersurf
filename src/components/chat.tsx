// src/components/ChatPromptGenerator.tsx
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { chatWithAI } from "../lib/groq";

interface ChatPromptGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
  style: string;
  keywords: string[];
  onSavePrompt: (prompt: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatPromptGenerator = ({
  isOpen,
  onClose,
  initialPrompt,
  style,
  keywords,
  onSavePrompt,
}: ChatPromptGeneratorProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [copySuccess, setCopySuccess] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const initialMessages: Message[] = [];

      if (initialPrompt) {
        initialMessages.push({
          role: "assistant",
          content: `Hi there 👋, I can help you refine prompt:\n\n"${initialPrompt}"\n\nHow would you like to improve it?`,
        });
      } else {
        initialMessages.push({
          role: "assistant",
          content:
            "Hi there 👋, I can help you refine prompts or create new ones from scratch. What kind of character or scene would you like to create?",
        });
      }

      setMessages(initialMessages);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await chatWithAI({
        messages: updatedMessages,
        style,
        keywords,
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // const handleCopy = async (text: string) => {
  //     try {
  //         await navigator.clipboard.writeText(text);
  //         setCopySuccess("Copied!");
  //         setTimeout(() => setCopySuccess(""), 2000);
  //     } catch (err) {
  //         console.error("Failed to copy: ", err);
  //     }
  // };

  const handleSavePrompt = () => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (lastAssistantMessage) {
      const content = lastAssistantMessage.content;

      const match = content.match(/"([^"]+)"/);
      const prompt = match ? match[1] : content;

      onSavePrompt(prompt);
    }
  };

  const handleResizeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden shadow-xl">
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-base md:text-xl font-bold text-white">Daydream Assistant</h2>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSavePrompt}
              className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base rounded-md px-3 py-1"
            >
              Save Prompt
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {/* {message.role === "assistant" && (
                                    <button
                                        onClick={() => handleCopy(message.content)}
                                        className="mt-2 text-gray-400 hover:text-white flex items-center gap-1 text-xs"
                                    >
                                        <Copy size={12} />
                                        {copySuccess && index === messages.length - 1
                                            ? copySuccess
                                            : "Copy"}
                                    </button>
                                )} */}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-xl bg-gray-800 text-white">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleResizeInput(e);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none min-h-[44px] max-h-[200px]"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg h-[44px] w-[44px] flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPromptGenerator;
