import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is PeerSurf?",
      answer: "PeerSurf is a platform that helps developers, builders, and creators discover opportunities in the Blockchain ecosystem. We connect you with orchestrators, delegation opportunities, and rewards in the decentralized video network."
    },
    {
      question: "What is Blockchain delegation?",
      answer: "Blockchain delegation lets you earn rewards by staking tokens with orchestrators who secure the decentralized video network. PeerSurf makes this accessible and helps you discover the best opportunities.",
    },
    {
      question: "How do I get started with PeerSurf?",
      answer: "Create an account, explore orchestrators and opportunities, choose your preferred delegation strategy, and start earning rewards. PeerSurf handles the complexity while you focus on building.",
    },
    {
      question: "Do I need crypto knowledge to use PeerSurf?",
      answer: "No! PeerSurf is designed to be accessible to everyone. We provide a user-friendly interface that abstracts away the blockchain complexity while still giving you access to all the opportunities.",
    },
    {
      question: "What opportunities can I discover on PeerSurf?",
      answer: "PeerSurf helps you discover orchestrators, delegation opportunities, rewards programs, and building opportunities within the Blockchain ecosystem. Whether you're a developer, creator, or investor, there are opportunities for everyone.",
    },
    {
      question: "Is PeerSurf secure?",
      answer: "Yes, PeerSurf uses industry-standard security practices and integrates with secure wallet providers. Your funds and data are protected with enterprise-grade security measures.",
    }
  ];

  return (
  <section className="w-full py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-green-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about discovering opportunities on PeerSurf
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-card/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300"
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-all duration-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-foreground group-hover:text-green-400 transition-colors duration-300">
                  {faq.question}
                </span>
                <span className="text-green-400 text-2xl transition-transform duration-300">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Still have questions? We're here to help.
          </p>
          <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;