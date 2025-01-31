import clsx from 'clsx';
import React from 'react'
interface Props{
    children: React.ReactNode;
    className?: string;
    padding_x?: string;
    padding_y?: string;
}

export default function Box({ children, className, padding_x="px-9", padding_y="py-9"}:Props) {
  return (
    <div className={clsx("w-full border border-gray-4 rounded bg-white", className, padding_x, padding_y)}>
      {children}
    </div>
  )
}