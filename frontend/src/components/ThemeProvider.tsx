"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// @ts-ignore - types might be missing in some environments but this is valid
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
