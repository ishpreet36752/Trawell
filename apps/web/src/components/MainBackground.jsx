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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden opacity-20 -z-10 blur-sm">
      <div className='flex w-full h-full justify-center items-center gap-4'>
        {
          [...Array(4)].map((_, colIndex) => (
            <motion.ul
              key={colIndex}
              className="flex flex-col w-[22rem] gap-5"
              initial={{ translateY: colIndex % 2 === 0 ? "0%" : "-50%" }}
              animate={{ translateY: colIndex % 2 === 0 ? "-50%" : "0%" }}
              transition={{
                duration: 20 + colIndex * 2,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {repeatedImages.map((src, index) => (
                <li key={`${colIndex}-${index}`} className="w-full flex-shrink-0">
                  <div className="w-[20rem] h-[25rem] mx-auto rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={src}
                      alt={`Travel ${colIndex}-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </li>
              ))}
            </motion.ul>
          ))
        }
      </div>
    </div>
  );
};

export default MainBackground;
