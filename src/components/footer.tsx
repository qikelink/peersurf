export const Footer = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto py-8 px-8 gap-4 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 mt-8">
      <div className=" md:flex-row items-center gap-2 hidden sm:flex">
        <span className="text-gray-500 text-sm text-center">
          Built on Livepeer
        </span>
        <span className="flex flex-wrap items-center justify-center ">
          <img src="/livepeer.webp" alt="Livepeer Logo" className="h-5" />
        </span>
      </div>
      <div className="text-gray-500 text-sm text-center mt-2 md:mt-0 ">
        &copy; {new Date().getFullYear()} Lisa Labs. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
