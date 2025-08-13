const Footer = () => {
  return (
    <footer className="w-full  bg-black">
      <div className="max-w-7xl mx-auto py-12 px-8">
        {/* Bottom: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PeerSurf. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="/privacy"
              className="text-gray-400 hover:text-white transition text-sm"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-gray-400 hover:text-white transition text-sm"
            >
              Terms
            </a>
            <a
              href="/cookies"
              className="text-gray-400 hover:text-white transition text-sm"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
