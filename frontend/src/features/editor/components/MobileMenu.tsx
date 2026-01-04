'use client';

import { useState } from 'react';
import { Menu, X, Search, Code, Database, Download, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCanvasStore } from '../stores/canvasStore';
import { cn } from '@/lib/utils/cn';

interface MobileMenuProps {
    onImport: () => void;
    onExport: () => void;
    onCode: () => void;
    onShare: () => void;
    onSave: () => void;
    saving: boolean;
    readOnly: boolean;
    styles: any; // Theme styles
}

export default function MobileMenu({
    onImport,
    onExport,
    onCode,
    onShare,
    onSave,
    saving,
    readOnly,
    styles: _propStyles // Ignore prop styles in favor of specific drawer styles
}: MobileMenuProps) {
    const [open, setOpen] = useState(false);
    const { metadata, setTheme, setEdgeStyle, setSearchTerm } = useCanvasStore();

    const getDrawerStyles = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'dark':
                return {
                    container: 'bg-slate-900 border-l border-slate-700',
                    text: 'text-slate-100',
                    subText: 'text-slate-400',
                    input: 'bg-slate-800 border-slate-700 text-slate-200 focus:ring-blue-500',
                    button: 'hover:bg-slate-800 text-slate-300 hover:text-white',
                    icon: 'text-slate-400',
                    divider: 'bg-slate-800'
                };
            case 'ocean':
                return {
                    container: 'bg-white border-l border-cyan-100',
                    text: 'text-cyan-900',
                    subText: 'text-cyan-600',
                    input: 'bg-cyan-50 border-cyan-200 text-cyan-900 focus:ring-cyan-500',
                    button: 'hover:bg-cyan-50 text-cyan-700 hover:text-cyan-900',
                    icon: 'text-cyan-400',
                    divider: 'bg-cyan-100'
                };
            case 'sunset':
                return {
                    container: 'bg-white border-l border-orange-100',
                    text: 'text-orange-900',
                    subText: 'text-orange-600',
                    input: 'bg-orange-50 border-orange-200 text-orange-900 focus:ring-orange-500',
                    button: 'hover:bg-orange-50 text-orange-700 hover:text-orange-900',
                    icon: 'text-orange-400',
                    divider: 'bg-orange-100'
                };
            default:
                return {
                    container: 'bg-white border-l border-gray-200',
                    text: 'text-gray-900',
                    subText: 'text-gray-500',
                    input: 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500',
                    button: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
                    icon: 'text-gray-400',
                    divider: 'bg-gray-100'
                };
        }
    };

    const styles = getDrawerStyles();

    return (
        <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className={styles.text}>
                <Menu className="w-5 h-5" />
            </Button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-fade-in"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed inset-y-0 right-0 w-[280px] shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out flex flex-col p-6",
                open ? "translate-x-0" : "translate-x-full",
                styles.container
            )}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className={cn("text-lg font-semibold", styles.text)}>Menu</h2>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className={styles.button}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="space-y-6 flex-1 overflow-y-auto">

                    {/* Search */}
                    <div className="space-y-2">
                        <label className={cn("text-xs font-semibold uppercase", styles.subText)}>Search</label>
                        <div className="relative">
                            <Search className={cn("w-4 h-4 absolute left-3 top-2.5", styles.icon)} />
                            <input
                                type="text"
                                placeholder="Search nodes..."
                                className={cn("w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 transition-all", styles.input)}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="space-y-3">
                        <label className={cn("text-xs font-semibold uppercase", styles.subText)}>Appearance</label>
                        <select
                            className={cn("w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-transparent", styles.input)}
                            value={metadata?.theme || 'default'}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="default" className="text-black">Default Theme</option>
                            <option value="ocean" className="text-black">Ocean Theme</option>
                            <option value="sunset" className="text-black">Sunset Theme</option>
                            <option value="dark" className="text-black">Dark Theme</option>
                        </select>
                        <select
                            className={cn("w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-transparent", styles.input)}
                            value={metadata?.edgeStyle || 'step'}
                            onChange={(e) => setEdgeStyle(e.target.value)}
                        >
                            <option value="step" className="text-black">Step Lines</option>
                            <option value="bezier" className="text-black">Bezier Curves</option>
                            <option value="straight" className="text-black">Straight Lines</option>
                        </select>
                    </div>

                    <div className={cn("h-px my-2", styles.divider)} />

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button variant="ghost" className={cn("w-full justify-start", styles.button)} onClick={() => { onCode(); setOpen(false); }}>
                            <Code className="w-4 h-4 mr-2" />
                            View Code
                        </Button>
                        <Button variant="ghost" className={cn("w-full justify-start", styles.button)} onClick={() => { onImport(); setOpen(false); }}>
                            <Database className="w-4 h-4 mr-2" />
                            Import SQL/JSON
                        </Button>
                        <Button variant="ghost" className={cn("w-full justify-start", styles.button)} onClick={() => { onExport(); setOpen(false); }}>
                            <Download className="w-4 h-4 mr-2" />
                            Export Diagram
                        </Button>
                        <Button variant="ghost" className={cn("w-full justify-start", styles.button)} onClick={() => { onShare(); setOpen(false); }}>
                            <Users className="w-4 h-4 mr-2" />
                            Share Project
                        </Button>
                    </div>
                </div>

                {/* Footer Action */}
                <div className={cn("pt-6 mt-auto border-t", styles.divider)}>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={() => { onSave(); setOpen(false); }}
                        disabled={saving || readOnly}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : readOnly ? 'Read Only' : 'Save Project'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
