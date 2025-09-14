import React from "react";
import { cn } from "../utils/utils";

const CardDemo = ({ connection }) => {
  const { _id, firstName, lastName, age, gender, image, about } = connection;

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "");

  return (
    <div className="min-w-xs w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl w-72 mx-auto backgroundImage flex flex-col justify-between p-4",
          "bg-cover bg-center"
        )}
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute w-full h-full left-0 top-0 transition duration-300 group-hover/card:bg-black opacity-20"></div>
        <div className="text content flex flex-col items-start justify-end h-full">
          <h1 className="font-bold text-xl md:text-2xl text-black relative z-10">
            {capitalize(firstName)} {capitalize(lastName)}
          </h1>
          <div className="flex font-semibold mt-2">
            <p className="text-black text-l mr-2 relative z-10">{age}</p>
            <p className="text-black text-l relative z-10">
              {capitalize(gender)}
            </p>
          </div>
          <p className="font-normal text-sm text-black relative z-10">
            {about}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardDemo;
