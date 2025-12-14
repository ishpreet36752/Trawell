import React, { useState } from "react";
import { motion } from "framer-motion";
import CreateAccountComponent from "./CreateAccountComponet";

const CreateAccount = () => {
    const [isOpen , setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center space-y-8 z-10 px-4">
      <h1 className="text-5xl md:text-6xl font-bold text-center text-gray-900 drop-shadow-2xl max-w-5xl">
        FIND FRIENDS THAT CAN TRAVEL ANYWHERE
      </h1>
      <motion.button
        className="text-2xl font-bold px-8 py-4 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700"
        initial={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }} 
        whileTap={{ scale: 0.95 }} 
        transition={{ type: "spring", stiffness: 200, damping: 10 }} 
        onClick={() => setIsOpen(true)}
      >
        Create Account
      </motion.button>

      {isOpen && <CreateAccountComponent onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default CreateAccount;
