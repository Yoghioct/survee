import React from 'react';
import Button from 'shared/components/Button/Button';
import clsx from 'clsx';

interface NewQuestionModalButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  testSelector?: string;
  disabled?: boolean;
  disabledReason?: string;
}

export default function NewQuestionModalButton({
  onClick,
  icon,
  text,
  testSelector,
  disabled = false,
  disabledReason,
}: NewQuestionModalButtonProps) {
  return (
    <div className="relative w-full aspect-square">
      <Button
        onClick={disabled ? undefined : onClick}
        className={clsx(
          "w-full h-full flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200",
          disabled 
            ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400" 
            : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm active:scale-95"
        )}
        data-test-id={testSelector}
        disabled={disabled}
      >
        <div className="w-6 h-6 mb-2 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm font-medium leading-tight text-center">
          {text}
        </span>
      </Button>
      {disabled && disabledReason && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-sm">
          {disabledReason}
        </div>
      )}
    </div>
  );
}
