import clsx from 'clsx';
import React from 'react';

interface NoteProps {
  title: string;
  description: string;
  classNames?: string;
}

export default function Note({ title, description, classNames }: NoteProps) {
  return (
    <div
      className={clsx(
        'mb-3 rounded-sm border-l-4 border-purple-500 bg-purple-100 px-4 py-2 text-left text-xs text-purple-700',
        classNames
      )}
      role="alert"
    >
      <p className="font-semibold">{title}</p>
      <p>{description}</p>
    </div>
  );
}
