import { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
}

const Card = ({ 
  className, 
  title, 
  children, 
  footer,
  ...props 
}: CardProps) => {
  return (
    <div 
      className={twMerge("bg-white rounded-lg shadow-sm border border-neutral-200", className)} 
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;