import React, { useState, useRef, useEffect, useContext, createContext, ReactNode } from "react";
import { cn } from "../../utils/utils";
import Image from "react";
import {CardContainerProps , CardBodyProps , CardItemProps} from "../../types/threeDCard"
type MouseEnterContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
const MouseEnterContext = createContext<MouseEnterContextType | null>(null);

export const CardContainer:React.FC<CardContainerProps> = ({ children, className, containerClassName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>):void => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseLeave = ():void => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={cn("pb-40 pt-5 px-5 max-h-screen flex items-center justify-center ", containerClassName)} style={{ perspective: "1000px" }}>
        <div
          ref={containerRef}
          onMouseEnter={() => setIsMouseEntered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("flex items-center justify-center relative transition-all duration-200 ease-linear ", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={cn("h-[27rem] w-96 [transform-style:preserve-3d]", className)}>{children}</div>
);

export const CardItem:React.FC<CardItemProps> = ({ as: Tag = "div", children, className, translateZ = 0, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(MouseEnterContext);
  if (!context) {
  throw new Error("CardItem must be used within a CardContainer");
  }
  const [isMouseEntered] = context;
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = isMouseEntered
      ? `translateZ(${translateZ}px)`
      : "translateZ(0px)";
  }, [isMouseEntered, translateZ]);


  return (
    <Tag  ref={ref as React.RefObject<any>} className={cn("w-fit transition duration-200 ease-linear ", className)} {...rest}>
      {children}
    </Tag>
  );
};
