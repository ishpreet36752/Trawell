import { ElementType, ReactNode } from "react";

export interface CardContainerProps{
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}
export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}
export interface CardItemProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  translateZ?: number;
  [key: string]: any;
}