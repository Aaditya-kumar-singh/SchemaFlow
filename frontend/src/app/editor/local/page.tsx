'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Code, Search, Download,
    Braces, Table2, ChevronDown
} from 'lucide-react';
import DiagramEditor from '@/features/editor/components/DiagramEditor';
import PropertiesPanel from '@/features/editor/components/PropertiesPanel';
import { useCanvasStore } from '@/features/editor/stores/canvasStore';
import CodePreviewPanel from '@/features/editor/components/CodePreviewPanel';
import { cn } from '@/lib/utils/cn';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { generateMySQL, generateMongoose } from '@/features/editor/utils/codeGenerator';

const LOCAL_PROJECT_ID = 'local-draft';

type DbType = 'MYSQL' | 'MONGODB';

// ─── Theme helper (same as cloud editor) ─────────────────────────────────────
function useThemeStyles(theme: string) {
    switch (theme) {
        case 'dark':
            return {
                container: 'bg-slate-900',
                toolbar: 'bg-slate-900 border-slate-700',
                text: 'text-slate-100',
                subText: 'text-slate-400',
                border: 'border-slate-700',
                input: 'bg-slate-800 border-slate-600 text-slate-200 focus:ring-blue-500 hover:bg-slate-700',
                button: 'border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white',
                icon: 'text-slate-400',
            };
        case 'ocean':
            return {
                container: 'bg-cyan-50/30',
                toolbar: 'bg-white border-cyan-100',
                text: 'text-cyan-900',
                subText: 'text-cyan-600',
                border: 'border-cyan-100',
                input: 'bg-cyan-50 border-cyan-200 text-cyan-900 focus:ring-cyan-500 hover:bg-white',
                button: 'border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-900',
                icon: 'text-cyan-400',
            };
        case 'sunset':
            return {
                container: 'bg-orange-50/30',
                toolbar: 'bg-white border-orange-100',
                text: 'text-orange-900',
                subText: 'text-orange-600',
                border: 'border-orange-100',
                input: 'bg-orange-50 border-orange-200 text-orange-900 focus:ring-orange-500 hover:bg-white',
                button: 'border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-900',
                icon: 'text-orange-400',
            };
        default:
            return {
                container: 'bg-white',
                toolbar: 'bg-white border-gray-200',
                text: 'text-gray-900',
                subText: 'text-gray-500',
                border: 'border-gray-200',
                input: 'bg-gray-50 border-gray-200 text-gray-700 focus:ring-blue-500 hover:bg-white',
                button: 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                icon: 'text-gray-400',
            };
    }
}

// ─── Inner Component (needs Suspense because it uses useSearchParams) ────────
function LocalEditorInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [codePreviewOpen, setCodePreviewOpen] = useState(false);

    // ── Read ?type= from URL — this is the ROOT FIX ─────────────────────────
    const typeParam = searchParams.get('type');
    const initialType: DbType =
        typeParam === 'MONGODB' ? 'MONGODB' : 'MYSQL';
    const [dbType, setDbType] = useState<DbType>(initialType);

    const { metadata, nodes, edges } = useCanvasStore();
    const styles = useThemeStyles(metadata?.theme || 'default');
    const isMongo = dbType === 'MONGODB';

    // ── Initialise canvas on mount AND whenever dbType changes ───────────────
    const initCanvas = useCallback((type: DbType) => {
        useCanvasStore.getState().setInitialContent({
            nodes: [],
            edges: [],
            metadata: { version: 1, dbType: type, theme: 'default' },
        });
        useCanvasStore.getState().setProjectId(LOCAL_PROJECT_ID);
    }, []);

    // Run on first mount with the correct db type from URL
    useEffect(() => {
        initCanvas(dbType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dbType]);

    const handleSwitchDb = (type: DbType) => {
        if (type === dbType) return;
        const confirmed = nodes.length === 0 || window.confirm(
            `Switch to ${type === 'MONGODB' ? 'MongoDB' : 'MySQL'} canvas? Your current diagram will be cleared.`
        );
        if (!confirmed) return;
        setDbType(type);
        // Sync URL so refresh preserves the canvas type
        router.replace(`/editor/local?type=${type}`);
    };

    // ── Export (client-side, no backend) ────────────────────────────────────
    const handleExport = () => {
        const content = isMongo
            ? generateMongoose(nodes)
            : generateMySQL(nodes, edges);
        const filename = isMongo ? 'schema.js' : 'schema.sql';
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={cn('h-screen flex flex-col transition-colors duration-300', styles.container)}>

            {/* ─── Top Toolbar ───────────────────────────────────────────────── */}
            <div className={cn('h-14 border-b flex items-center px-4 justify-between transition-colors duration-300', styles.toolbar)}>

                {/* Left: back + project identity */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')} className={styles.text}>
                        <ArrowLeft className={cn('w-4 h-4 mr-2', styles.icon)} />
                        Exit
                    </Button>

                    <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md opacity-60" />
                        <div>
                            <h1 className={cn('font-semibold transition-colors', styles.text)}>Local Playground</h1>

                            {/* DB-type pill badge */}
                            <span className={cn(
                                'inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full',
                                isMongo
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-blue-100 text-blue-700'
                            )}>
                                {isMongo
                                    ? <Braces className="w-3 h-3" />
                                    : <Table2 className="w-3 h-3" />}
                                {isMongo ? 'MongoDB' : 'MySQL'}
                            </span>
                        </div>
                    </div>

                    {/* DB-type switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'flex items-center gap-1 text-xs font-semibold transition-colors',
                                    isMongo
                                        ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                                        : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                                )}
                            >
                                {isMongo ? <Braces className="w-3.5 h-3.5" /> : <Table2 className="w-3.5 h-3.5" />}
                                Switch Canvas
                                <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52 bg-white/95 backdrop-blur-xl shadow-xl">
                            <DropdownMenuItem
                                onClick={() => handleSwitchDb('MYSQL')}
                                className={cn(
                                    'cursor-pointer flex items-center gap-2 font-medium',
                                    dbType === 'MYSQL' && 'bg-blue-50 text-blue-700'
                                )}
                            >
                                <Table2 className="w-4 h-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-semibold">MySQL Canvas</p>
                                    <p className="text-[10px] text-gray-500">Tables · PK/FK · SQL DDL</p>
                                </div>
                                {dbType === 'MYSQL' && (
                                    <span className="ml-auto text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Active</span>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSwitchDb('MONGODB')}
                                className={cn(
                                    'cursor-pointer flex items-center gap-2 font-medium',
                                    dbType === 'MONGODB' && 'bg-emerald-50 text-emerald-700'
                                )}
                            >
                                <Braces className="w-4 h-4 text-emerald-600" />
                                <div>
                                    <p className="text-sm font-semibold">MongoDB Canvas</p>
                                    <p className="text-[10px] text-gray-500">Collections · ObjectId · Mongoose</p>
                                </div>
                                {dbType === 'MONGODB' && (
                                    <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Active</span>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Right: toolbar actions */}
                <div className="flex items-center gap-2">
                    {/* Theme & Edge style */}
                    <div className={cn('inline-flex items-center gap-2 mr-2 border-r pr-3', styles.border)}>
                        <select
                            className={cn('text-xs border rounded px-2 py-1.5 focus:outline-none focus:ring-1 transition-all cursor-pointer', styles.input)}
                            value={metadata?.theme || 'default'}
                            onChange={(e) => useCanvasStore.getState().setTheme(e.target.value)}
                            title="Theme"
                        >
                            <option value="default">Theme: Default</option>
                            <option value="ocean">Theme: Ocean</option>
                            <option value="sunset">Theme: Sunset</option>
                            <option value="dark">Theme: Dark</option>
                        </select>
                        <select
                            className={cn('text-xs border rounded px-2 py-1.5 focus:outline-none focus:ring-1 transition-all cursor-pointer', styles.input)}
                            value={metadata?.edgeStyle || 'step'}
                            onChange={(e) => useCanvasStore.getState().setEdgeStyle(e.target.value)}
                            title="Edge Style"
                        >
                            <option value="step">Lines: Step</option>
                            <option value="bezier">Lines: Bezier</option>
                            <option value="straight">Lines: Straight</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative mr-2">
                        <Search className={cn('w-4 h-4 absolute left-2 top-1.5', styles.icon)} />
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            className={cn('pl-8 pr-4 py-1 text-xs border rounded focus:outline-none focus:ring-1 transition-all w-28 focus:w-44', styles.input)}
                            onChange={(e) => useCanvasStore.getState().setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Code preview */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCodePreviewOpen(!codePreviewOpen)}
                        className={cn('transition-colors', styles.button)}
                    >
                        <Code className={cn('w-4 h-4 mr-2', styles.icon)} />
                        {isMongo ? 'Mongoose' : 'SQL'}
                    </Button>

                    {/* Export */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className={cn('transition-colors', styles.button)}
                    >
                        <Download className={cn('w-4 h-4 mr-2', styles.icon)} />
                        {isMongo ? 'Mongoose Schema' : 'SQL Script'}
                    </Button>

                    {/* CTA */}
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push('/register')}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 ml-1"
                    >
                        Sign Up to Save
                    </Button>
                </div>
            </div>

            {/* ─── Canvas + Properties ────────────────────────────────────────── */}
            <div className={cn('flex-1 relative overflow-hidden flex', styles.container)}>
                <div className="flex-1 relative">
                    <DiagramEditor
                        projectId={LOCAL_PROJECT_ID}
                        initialContent={{
                            nodes: [],
                            edges: [],
                            metadata: { dbType, theme: metadata?.theme || 'default' },
                        }}
                    />
                </div>
                <PropertiesPanel />
            </div>

            <CodePreviewPanel open={codePreviewOpen} onClose={() => setCodePreviewOpen(false)} />
        </div>
    );
}

// ─── Page export — wraps inner in Suspense (required by Next.js for useSearchParams) ───
export default function LocalEditorPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading Editor...</p>
                </div>
            </div>
        }>
            <LocalEditorInner />
        </Suspense>
    );
}
