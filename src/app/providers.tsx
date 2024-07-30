"use client";

import React from 'react';
import { ReactDOM } from 'react';

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/system";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <main className="dark text-foreground bg-background">
                <SessionProvider>{children}</SessionProvider>;
            </main>
        </NextUIProvider>
    )
}