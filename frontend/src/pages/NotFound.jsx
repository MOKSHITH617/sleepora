import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-[#FFFDFC]">
      <MetaTags 
        title="404 Page Not Found | Sleepora" 
        description="The page you looking for could not be found." 
      />
      
      <div className="w-20 h-20 bg-[#F8F5EF] border border-[#E0D8CE] rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">
        🛌
      </div>

      <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#201712] mb-3">
        Page Not Found
      </h1>

      <p className="text-sm md:text-base text-[#6D6258] max-w-md mb-8 leading-relaxed">
        The page you are looking for might have been moved or does not exist. Explore our luxury mattresses or handcrafted sofas below.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/mattresses" 
          className="bg-[#8B6844] hover:bg-[#6D5134] text-white font-bold text-xs uppercase tracking-[2px] py-3.5 px-8 rounded-full shadow-md transition-colors"
        >
          Explore Mattresses
        </Link>
        <Link 
          to="/sofas" 
          className="bg-white border border-[#8B6844] text-[#8B6844] hover:bg-[#F8F5EF] font-bold text-xs uppercase tracking-[2px] py-3.5 px-8 rounded-full shadow-xs transition-colors"
        >
          Explore Sofas
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
