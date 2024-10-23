const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 font-firacode">
      <div className="relative mb-4">
        <div className="w-24 h-24 border-purple-600 border-8 rounded-full opacity-25"></div>
        <div className="w-24 h-24 border-purple-500 border-t-8 animate-spin rounded-full absolute left-0 top-0"></div>
      </div>
      <div className="text-purple-300 text-2xl mt-4 font-bold">
        <span className="inline-block animate-bounce">S</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.1s'}}>p</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.2s'}}>o</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.3s'}}>c</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.4s'}}>o</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.5s'}}>f</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.6s'}}>y</span>
      </div>
    </div>
  );
};

export default Loading;
