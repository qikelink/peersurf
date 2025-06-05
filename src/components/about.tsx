const About = () => {
  return (
    <div className="bg-black text-white/90 font-gamja max-w-5xl mx-auto space-y-4 px-6 md:px-0">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">
          An Editor For Everyone
        </h1>
      </div>

      <div>
        <img src="/4.png" alt="Daydream Live" className="w-full h-full" />
      </div>

      {/* Powered by Livepeer */}
      <section className="flex flex-col items-center justify-center my-16">
        <div className="flex items-center space-x-3 ">
          <img
            src="/livepeer.webp"
            alt="Livepeer"
            className="w-6 h-6 md:w-7 md:h-7 rounded-full"
          />
          <div className="text-center">
            <p className="text-lg text-white/70 font-medium">
              Powered by Livepeer
            </p>
          </div>
        </div>
      </section>

      {/* <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 cursor-pointer text-white font-bold py-2 px-8 rounded-full text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-2xl">
          Get early access
        </button>
        <p className="text-gray-400 mt-4">Join to be notified when we launch</p>
      </div> */}
    </div>
  );
};

export default About;

{
  /* Comparison Section */
}
//   <div className="flex items-stretch justify-center gap-8 max-w-5xl mx-auto mt-10">
//     {/* Traditional Card */}
//     <div className="flex-1 rounded-2xl p-8 backdrop-blur-sm bg-white/5">
//       <h3 className="text-2xl font-bold mb-6 text-center">
//         Traditional Video
//       </h3>
//       <div className="space-y-4">
//         <div className="flex justify-between items-center py-3 border-b border-gray-800">
//           <span className="text-white/60">Complex Animations & Effects</span>
//           <span className="text-red-400 font-semibold">$10,000</span>
//         </div>
//         <div className="flex justify-between items-center py-3 border-b border-gray-800">
//           <span className="text-white/60">Professional Equipment</span>
//           <span className="text-red-400 font-semibold">$50,000</span>
//         </div>
//         <div className="flex justify-between items-center py-3 border-b border-gray-800">
//           <span className="text-white/60">Skilled Visual Artists</span>
//           <span className="text-red-400 font-semibold">$5,000</span>
//         </div>
//         <div className="flex justify-between items-center py-3">
//           <span className="text-white/60">Post-Production & Editing</span>
//           <span className="text-red-400 font-semibold">$3,000</span>
//         </div>
//       </div>
//     </div>

//     {/* DreamVideo Card */}
//     <div className="flex-1 rounded-2xl p-8 backdrop-blur-sm bg-white/5">
//       <h3 className="text-2xl font-bold mb-6 text-center ">
//         With DreamVideo
//       </h3>
//       <div className="space-y-4">
//         <div className="flex items-center justify-between py-3 border-b border-gray-800">
//           <div className="flex items-center space-x-3">
//             <CircleCheck
//               size={16}
//               className="text-green-400 flex-shrink-0"
//             />
//             <span className="text-white/60">No Learning Curve</span>
//           </div>
//           <span className="text-red-400 line-through font-semibold">
//             $10,000
//           </span>
//         </div>

//         <div className="flex items-center justify-between py-3 border-b border-gray-600">
//           <div className="flex items-center space-x-3">
//             <CircleCheck
//               size={16}
//               className="text-green-400 flex-shrink-0"
//             />
//             <span className="text-white/60">
//               Available on Mobile & Desktop
//             </span>
//           </div>
//           <span className="text-red-400 line-through font-semibold">
//             $50,000
//           </span>
//         </div>

//         <div className="flex items-center justify-between py-3 border-b border-gray-600">
//           <div className="flex items-center space-x-3">
//             <CircleCheck
//               size={16}
//               className="text-green-400 flex-shrink-0"
//             />
//             <span className="text-white/60">
//               Edit With Natural Language
//             </span>
//           </div>
//           <span className="text-red-400 line-through font-semibold">
//             $5,000
//           </span>
//         </div>

//         <div className="flex items-center justify-between py-3">
//           <div className="flex items-center space-x-3">
//             <CircleCheck
//               size={16}
//               className="text-green-400 flex-shrink-0"
//             />
//             <span className="text-white/60">Available Instantly</span>
//           </div>
//           <span className="text-red-400 line-through font-semibold">
//             $3,000
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
