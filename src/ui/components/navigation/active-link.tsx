interface Props{
    href: string;
    children: React.ReactNode;
    className?: string;
}
import Link from 'next/link';
import {useRouter} from 'next/router';
import clsx from "clsx";
import React from 'react'
import {useMemo} from 'react';

export default function ActiveLink({href, children, className}:Props) {
    const router = useRouter();
    const isActive = useMemo(()=>{
        return router.pathname === href
    },[router.pathname, href]);
  return (
    <Link href={href} className={clsx( className,isActive && "text-primary font-medium ")}>
      {children}
    </Link>
  )
}
