"use client";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/system";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <SessionProvider>{children}</SessionProvider>;
        </NextUIProvider>
    )
}