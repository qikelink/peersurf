import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const FAQ = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: "How does the AI video generation work?",
      answer: "Our AI analyzes your clip and adds trending music, captions, and effects to create viral-style videos automatically."
    },
    {
      id: 2,
      question: "What video formats do you support?",
      answer: "MP4, MOV, AVI, and WebM formats. Max 10 minutes long and 1GB file size."
    },
    {
      id: 3,
      question: "Can I customize the generated videos?",
      answer: "Yes! Unlimited customization including voiceovers, music, captions, filters, effects, and branding."
    },
    {
      id: 4,
      question: "How long does it take to generate a video?",
      answer: "2-5 minutes depending on video length and complexity. You'll get notified when ready."
    }
  ];

  const toggleQuestion = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-6 mt-32 font-inter">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-medium mb-4 text-gray-900 px-20">
          Things you might wanna know
        </h2>
        <p className="text-gray-500">
          Still have questions? contact us on discord or X
        </p>
      </div>

      <div className="w-full space-y-4 px-10">
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
                px-6 
                py-7
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
              <span className="font-medium text-gray-800 text-sm">
                {faq.question}
              </span>
              <Plus
                className={`
                  w-5 
                  h-5 
                  text-gray-500 
                  transform 
                  transition-transform 
                  duration-200 
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
              <div className="px-3 pb-4 text-gray-500 text-sm">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
