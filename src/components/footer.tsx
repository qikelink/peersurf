const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 dark:bg-black">
      <div className="max-w-7xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded flex items-center justify-center">
              <img width="94" height="94" src="onyx.png" alt="telegram"/>

              </div>
              <span className="text-xl font-bold text-white">PeerSurf</span>
            </div>
            <p className="text-white/80 text-sm max-w-md">
              Streamlining bounty discovery, contributor reputation, and payment workflows for the Livepeer ecosystem.
            </p>
          </div>
          
          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {['About PeerSurf', 'Contributors', 'SPEs', 'Foundation'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Ecosystem Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Ecosystem</h4>
            <ul className="space-y-2">
              {['Livepeer Network', 'Video Infrastructure', 'Decentralized Streaming', 'Web3 Video'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Features Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              {['Bounty Discovery', 'Reputation System', 'Payment Processing', 'AI Chatbot'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Get In Touch */}
        <div className="border-t border-white/20 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-semibold mb-2">Get In Touch</h4>
              <a href="mailto:hello@peersurf.com" className="text-white/70 hover:text-white transition text-sm">
                hello@peersurf.com
              </a>
              <div className="flex gap-3 mt-3">
                <a href="#" className="w-8 h-8  rounded flex items-center justify-center transition">
                <img width="94" height="94" src="https://img.icons8.com/3d-fluency/94/telegram.png" alt="telegram"/>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-400  rounded flex items-center justify-center transition">
                <img width="96" height="96" src="https://img.icons8.com/material-outlined/96/github.png" alt="github"/>
                </a>
                <a href="#" className="w-8 h-8  rounded flex items-center justify-center transition">
                <img width="96" height="96" src="https://img.icons8.com/color/96/discord-logo.png" alt="discord-logo"/>
                </a>
              </div>
            </div>
            
            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-white/70 text-sm">
                © {new Date().getFullYear()} PeerSurf. All rights reserved
              </p>
              <div className="flex gap-4">
                <a href="/terms" className="text-white/70 hover:text-white transition text-sm">
                  Terms & Conditions
                </a>
                <a href="/privacy" className="text-white/70 hover:text-white transition text-sm">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
