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
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-700 underline"
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
      question: "What is Livepeer delegation?",
      answer:
        "Livepeer delegation lets you earn rewards by staking LPT tokens with orchestrators who secure the decentralized video network. Lisa makes this accessible without needing crypto knowledge.",
    },
    {
      id: 2,
      question: "How do I start delegating on Livepeer?",
      answer:
        "Fund your wallet with local currency, choose a Livepeer orchestrator, and delegate your stake. Lisa handles all the blockchain complexity for you.",
    },
    {
      id: 3,
      question: "Do I need to buy LPT or ETH?",
      answer:
        "No! Lisa lets you delegate on Livepeer using your local currency. We handle the LPT purchase and gas fees behind the scenes.",
    },
    {
      id: 4,
      question: "How are Livepeer rewards calculated?",
      answer:
        "Rewards are based on your orchestrator's APY (up to 65%) minus their fee percentage. You earn LPT tokens automatically.",
    },
    {
      id: 5,
      question: "Is Livepeer delegation secure?",
      answer:
        "Yes. Livepeer is a battle-tested protocol, and your funds remain in your control. Check [Livepeer docs](https://livepeer.org/docs) for technical details.",
    },
    {
      id: 6,
      question: "Where can I learn more about Livepeer?",
      answer:
        "Join the [Livepeer Discord](https://discord.gg/livepeer) or follow [@livepeer](https://twitter.com/livepeer) for updates and community support.",
    },
  ];

  const toggleQuestion = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <section className="flex flex-col items-center justify-center max-w-4xl mx-auto py-14 px-8 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 px-2 sm:px-8 lg:px-20">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 mt-2 text-base max-w-2xl mx-auto">
          Everything you need to know about Livepeer delegation and earning rewards.
        </p>
      </div>
      <div className="w-full space-y-3 sm:space-y-4 sm:px-10 ">
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
              <div className="px-3 pb-4 sm:pb-6 text-gray-500 text-sm leading-relaxed">
                {renderTextWithLinks(faq.answer)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;