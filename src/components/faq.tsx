import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const FAQ = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const renderTextWithLinks = (text: string) => {
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 underline"
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const faqData = [
    {
      id: 1,
      question: "How does ONYX work?",
      answer:
        "Import your daydream clip from daydream.live, then one-click transforms it with AI voices, trending music, captions, and viral effects.",
    },
    {
      id: 2,
      question: "What's a daydream clip?",
      answer:
        "A 10-30 second video you create on daydream.live that becomes the foundation for your viral content.",
    },
    {
      id: 3,
      question: "Can I customize the generated videos?",
      answer:
        "Yes! Edit voiceovers, swap music, adjust captions, and modify effects after the AI transformation.",
    },
    {
      id: 4,
      question: "What makes videos go viral?",
      answer:
        "ONYX adds trending music, engaging AI voiceovers, eye-catching captions, and proven effects that boost engagement.",
    },
    {
      id: 5,
      question: "I still have questions!",
      answer:
        "Send us a message on [twitter](https://x.com/onyx_video) or join our [discord server](https://discord.gg/qVktYgHfZR)",
    },
  ];

  const toggleQuestion = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 lg:mt-32 font-inter">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 px-2 sm:px-8 lg:px-20">
          Things you might wanna know
        </h2>
      </div>

      <div className="w-full space-y-3 sm:space-y-4 px-2 sm:px-6 lg:px-10">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Button
              variant="ghost"
              onClick={() => toggleQuestion(faq.id)}
              className={`
                w-full 
                px-4 sm:px-6 
                py-5 sm:py-7
                text-left 
                flex 
                justify-between 
                items-center 
                bg-transparent 
                focus:outline-none 
                focus:ring-0 
                active:bg-transparent 
                rounded-lg
                hover:bg-transparent
                cursor-pointer
                text-gray-800
              `}
            >
              <span className="font-medium text-gray-800 text-sm sm:text-base pr-4">
                {faq.question}
              </span>
              <Plus
                className={`
                  w-4 h-4 sm:w-5 sm:h-5 
                  text-gray-500 
                  transform 
                  transition-transform 
                  duration-200 
                  flex-shrink-0
                  ${expandedQuestion === faq.id ? "rotate-45" : ""}
                `}
              />
            </Button>

            <div
              className={`
                overflow-hidden 
                transition-all 
                duration-300 
                ease-in-out 
                ${
                  expandedQuestion === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-500 text-sm sm:text-base leading-relaxed">
                {renderTextWithLinks(faq.answer)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default FAQ;