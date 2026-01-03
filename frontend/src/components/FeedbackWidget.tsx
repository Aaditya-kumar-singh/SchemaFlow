"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus, X } from "lucide-react"
import { toast } from "sonner"

export function FeedbackWidget() {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState("feedback")
    const [message, setMessage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here API call would go
        toast.success("Thanks for your feedback! We'll look into it.")
        setOpen(false)
        setMessage("")
        setCategory("feedback")
    }

    return (
        <>
            <Button
                className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg h-12 w-12 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setOpen(true)}
            >
                <MessageSquarePlus className="h-6 w-6" />
                <span className="sr-only">Feedback</span>
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Send Feedback</h3>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-slate-500 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Help us improve SchemaFlow! Report a bug or suggest a feature.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200">Category</label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                                    >
                                        <option value="feedback">General Feedback</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="bug">Report a Bug</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200">Message</label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us what you think..."
                                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 resize-none"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button type="submit">Send Feedback</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
