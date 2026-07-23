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
    const getThemeStyles = () => {
        switch (theme) {
            case 'dark':
                return {
                    card: 'bg-slate-800/80 border-slate-700 text-slate-300 shadow-slate-900/50',
                    iconBg: 'bg-slate-700/50',
                    title: 'text-slate-200',
                    primaryBtn: isMongo ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white',
                    secondaryBtn: 'bg-white/5 border-slate-600 hover:bg-slate-700 text-slate-300',
                    badge: 'bg-emerald-900/40 text-emerald-400'
                };
            case 'ocean':
                return {
                    card: 'bg-white/80 border-cyan-200/50 text-cyan-900 shadow-cyan-200/50 hover:scale-[1.02]',
                    iconBg: 'bg-cyan-50',
                    title: 'text-cyan-900',
                    primaryBtn: isMongo ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white',
                    secondaryBtn: 'bg-white/50 border-cyan-200 hover:bg-cyan-50 text-cyan-700',
                    badge: 'bg-cyan-50 text-cyan-700'
                };
            case 'sunset':
                return {
                    card: 'bg-white/80 border-orange-200/50 text-orange-900 shadow-orange-200/50 hover:scale-[1.02]',
                    iconBg: 'bg-orange-50',
                    title: 'text-orange-900',
                    primaryBtn: isMongo ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white',
                    secondaryBtn: 'bg-white/50 border-orange-200 hover:bg-orange-50 text-orange-700',
                    badge: 'bg-orange-50 text-orange-700'
                };
            default:
                return {
                    card: 'bg-white/80 border-gray-200/50 text-gray-500 shadow-gray-200/50 hover:scale-[1.02]',
                    iconBg: 'bg-gray-100/50',
                    title: 'text-gray-900',
                    primaryBtn: isMongo ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
                    secondaryBtn: 'bg-white/50 border-gray-200 hover:bg-gray-50 text-gray-700',
                    badge: 'bg-gray-50 text-gray-700'
                };
        }
    };

    const styles = getThemeStyles();
    const isDark = theme === 'dark';

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className={cn(
                "text-center p-8 rounded-2xl border flex flex-col items-center gap-4 pointer-events-auto shadow-xl max-w-sm mx-auto backdrop-blur-md transition-all duration-300",
                styles.card
            )}>
                {/* Animated icon with a premium live dot */}
                <div className="relative">
                    <div className={cn(
                        "p-4 rounded-full mb-1 transition-colors duration-300",
                        styles.iconBg,
                        isMongo && !isDark && theme !== 'ocean' && theme !== 'sunset' ? "bg-emerald-50" : ""
                    )}>
                        {isMongo ? (
                            <Braces className={cn("w-10 h-10 transition-colors", isDark ? "text-emerald-400" : "text-emerald-600")} />
                        ) : (
                            <Table2 className={cn("w-10 h-10 transition-colors", isDark ? "text-blue-400" : (theme === 'ocean' ? "text-cyan-600" : (theme === 'sunset' ? "text-orange-600" : "text-blue-600")))} />
                        )}
                    </div>
                    <span className={cn(
                        "absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white animate-pulse",
                        isMongo ? "bg-emerald-500" : "bg-blue-500"
                    )} />
                </div>

                {/* Text & description */}
                <div className="space-y-1.5">
                    <h3 className={cn("text-xl font-bold tracking-tight", styles.title)}>
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
                        isMongo && !isDark && theme !== 'ocean' && theme !== 'sunset' ? "bg-emerald-50 text-emerald-700" : styles.badge
                    )}>
                        <Zap className="w-3 h-3" />
                        {isMongo ? 'Exports Mongoose Schema' : 'Exports SQL DDL Script'}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-2 w-full">
                    <Button onClick={onAdd} size="lg" className={cn(
                        "flex-1 shadow-md transition-all active:scale-95 font-semibold",
                        styles.primaryBtn
                    )}>
                        <Plus className="w-4 h-4 mr-2" />
                        {isMongo ? 'Add Collection' : 'Add Table'}
                    </Button>
                    <Button onClick={onImport} size="lg" variant="outline" className={cn(
                        "flex-1 shadow-sm transition-all active:scale-95",
                        styles.secondaryBtn
                    )}>
                        <FileInput className="w-4 h-4 mr-2" />
                        Import
                    </Button>
                </div>
            </div>
        </div>
    );
}
