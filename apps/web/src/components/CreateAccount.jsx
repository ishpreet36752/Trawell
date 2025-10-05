import React, { useState } from "react";
import { motion } from "framer-motion";
import CreateAccountComponent from "./CreateAccountComponet";
import { MapPin, Users, Shield, Compass } from "lucide-react";

const CreateAccount = () => {
    const [isOpen , setIsOpen] = useState(false);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Find Travel Buddies",
      description: "Connect with like-minded travelers heading to the same destination"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Explore Together",
      description: "Discover hidden gems and create unforgettable memories"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Verified",
      description: "Travel with confidence using our verified user community"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Plan Your Journey",
      description: "Collaborative trip planning tools to make travel easier"
    }
  ];

  return (
    <div className="relative -my-[40rem] min-h-screen">
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl"
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6 px-6 py-2 bg-ocean-100 text-ocean-700 rounded-full text-sm font-semibold shadow-lg"
          >
            🌍 Your Adventure Starts Here
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-ocean-600 to-coral-500 bg-clip-text text-transparent">
              Find Friends
            </span>
            <br />
            <span className="text-gray-900">
              That Can Travel Anywhere
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-light"
          >
            Connect with fellow travelers, share experiences, and explore the world together. 
            Your next adventure companion is just a click away.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-ocean-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
            >
              Start Your Journey
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-white text-ocean-600 text-lg font-bold rounded-full shadow-lg border-2 border-ocean-200 hover:border-ocean-400 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-ocean-600">10K+</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Active Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-coral-500">150+</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-jungle-600">25K+</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Trips Planned</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose <span className="text-ocean-600">Trawell</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-ocean-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {isOpen && <CreateAccountComponent onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default CreateAccount;
