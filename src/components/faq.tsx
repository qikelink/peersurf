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
      question: "What is Lisa?",
      answer:
        "Lisa is the easiest way to delegate and earn rewards on the Livepeer network. You can fund your wallet with your local currency and stake to any orchestrator—no need to buy LPT or pay for gas fees yourself.",
    },
    {
      id: 2,
      question: "How do I start staking with Lisa?",
      answer:
        "Just connect your wallet, fund it with your local currency, and choose an orchestrator. Lisa handles all the blockchain transactions and fees for you.",
    },
    {
      id: 3,
      question: "Do I need to buy LPT or ETH?",
      answer:
        "No! Lisa lets you stake on Livepeer without ever buying LPT or ETH. You simply use your local currency, and Lisa takes care of the rest.",
    },
    {
      id: 4,
      question: "How are rewards paid out?",
      answer:
        "Rewards are automatically added to your Lisa wallet. You can withdraw or restake them at any time.",
    },
    {
      id: 5,
      question: "Is Lisa secure?",
      answer:
        "Yes. Lisa is built on and supported by Livepeer, and your funds are always in your control. For more details, check our [docs](https://livepeer.org/docs).",
    },
    {
      id: 6,
      question: "Where can I get help?",
      answer:
        "Join our [Discord](https://discord.gg/livepeer) or reach out on [Twitter](https://twitter.com/livepeer). We're here to help!",
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
          Everything you need to know about using Lisa to delegate and earn on Livepeer.
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