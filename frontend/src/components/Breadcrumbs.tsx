"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils/cn"

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-slate-500 dark:text-slate-400", className)}>
            <Link
                href="/dashboard"
                className="flex items-center hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
                <Home className="h-4 w-4 mr-1" />
                <span className="sr-only">Dashboard</span>
            </Link>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="h-4 w-4 mx-2 text-slate-400 dark:text-slate-600" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-semibold text-slate-900 dark:text-slate-50">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    )
}
