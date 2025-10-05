import React from 'react';
import { motion } from 'framer-motion';

const MainBackground = () => {
  const images = [
    'src/assets/images/0.jpeg',
    'src/assets/images/1.jpg',
    'src/assets/images/2.jpeg',
    'src/assets/images/3.jpg',
    'src/assets/images/4.jpg',
    'src/assets/images/5.jpg',
  ];

  // Duplicate the images for seamless looping
  const repeatedImages = [...images, ...images];

  return (
    <div className="relative -my-32 mx-0 w-screen h-screen overflow-hidden opacity-60 rotate-[-3deg] z-0 mr-[-15px] scrollbar-hide">
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60 z-10"></div>
      
      <div className='flex w-full h-full'>
        {
          [...Array(4)].map((_,colIndex) => (
            <motion.ul
            key={colIndex}
        className="flex flex-col w-[22rem] gap-5 h-[200%]"
        initial={{ translateY: "0%" }}
        animate={{ translateY: "-80%" }} // Move halfway as the list is doubled
        transition={{
          duration: 10 + colIndex * 2, // Varying speeds for each column
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {repeatedImages.map((src, index) => (
          <li key={`${colIndex}-${index}`} className="w-full flex-shrink-0">
            <div className="w-[20rem] h-[25rem] mx-auto rounded-xl overflow-hidden shadow-lg">
              <img
                src={src}
                alt={`Travel destination ${colIndex}-${index}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          </li>
        ))}
      </motion.ul>
          ))
        }
      
    </div></div>
  );
};

export default MainBackground;
