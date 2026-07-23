import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { Database, Plus, FileInput, Braces, Table2, Zap } from 'lucide-react';

interface CanvasEmptyStateProps {
    theme: string;
    isMongo: boolean;
    onAdd: () => void;
    onImport: () => void;
}

export default function CanvasEmptyState({ theme, isMongo, onAdd, onImport }: CanvasEmptyStateProps) {
    const isDark = theme === 'dark';

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className={cn(
                "text-center p-8 rounded-2xl border flex flex-col items-center gap-4 pointer-events-auto shadow-xl max-w-sm mx-auto backdrop-blur-md transition-all duration-300",
                isDark
                    ? "bg-slate-800/80 border-slate-700 text-slate-300 shadow-slate-900/50"
                    : "bg-white/85 border-gray-200/50 text-gray-500 shadow-gray-200/50 hover:scale-[1.02]"
            )}>

                {/* Animated icon */}
                <div className="relative">
                    <div className={cn(
                        "p-4 rounded-full mb-1 transition-colors duration-300",
                        isMongo
                            ? (isDark ? "bg-emerald-900/40" : "bg-emerald-50")
                            : (isDark ? "bg-blue-900/30" : "bg-blue-50")
                    )}>
                        {isMongo ? (
                            <Braces className={cn("w-10 h-10", isDark ? "text-emerald-400" : "text-emerald-600")} />
                        ) : (
                            <Table2 className={cn("w-10 h-10", isDark ? "text-blue-400" : "text-blue-600")} />
                        )}
                    </div>
                    {/* Live dot */}
                    <span className={cn(
                        "absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white animate-pulse",
                        isMongo ? "bg-emerald-500" : "bg-blue-500"
                    )} />
                </div>

                {/* Text */}
                <div className="space-y-1.5">
                    <h3 className={cn("text-xl font-bold tracking-tight", isDark ? "text-slate-200" : "text-gray-900")}>
                        {isMongo ? 'MongoDB Canvas' : 'MySQL Canvas'}
                    </h3>
                    <p className="text-sm opacity-75 max-w-[240px] leading-relaxed">
                        {isMongo
                            ? "Model collections with embedded documents and references. Add fields using MongoDB types like ObjectId, String, Array, and Object."
                            : "Design relational tables with columns, primary keys, and foreign key relationships. Generate production-ready SQL scripts instantly."
                        }
                    </p>
                    <div className={cn(
                        "inline-flex items-center gap-1 mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
                        isMongo
                            ? (isDark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-700")
                            : (isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-700")
                    )}>
                        <Zap className="w-3 h-3" />
                        {isMongo ? 'Exports Mongoose Schema' : 'Exports SQL DDL Script'}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-2 w-full">
                    <Button onClick={onAdd} size="lg" className={cn(
                        "flex-1 shadow-md transition-all active:scale-95 font-semibold",
                        isMongo
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : (isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700 text-white")
                    )}>
                        <Plus className="w-4 h-4 mr-2" />
                        {isMongo ? 'Add Collection' : 'Add Table'}
                    </Button>
                    <Button onClick={onImport} size="lg" variant="outline" className={cn(
                        "flex-1 shadow-sm transition-all active:scale-95",
                        isDark
                            ? "border-slate-600 hover:bg-slate-700 text-slate-300"
                            : (isMongo ? "border-emerald-200 hover:bg-emerald-50 text-emerald-700" : "border-blue-200 hover:bg-blue-50 text-blue-700")
                    )}>
                        <FileInput className="w-4 h-4 mr-2" />
                        Import
                    </Button>
                </div>
            </div>
        </div>
    );
}
