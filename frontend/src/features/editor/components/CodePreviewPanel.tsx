import { useMemo } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { generateMySQL, generateMongoose } from '../utils/codeGenerator';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodePreviewPanelProps {
    open: boolean;
    onClose: () => void;
}

export default function CodePreviewPanel({ open, onClose }: CodePreviewPanelProps) {
    const { nodes, edges, metadata } = useCanvasStore();
    const [copied, setCopied] = useState(false);

    const code = useMemo(() => {
        if (!open) return '';
        if (!nodes.length) return '-- Start designing to see code';

        if (metadata.dbType === 'MONGODB') {
            return generateMongoose(nodes);
        } else {
            return generateMySQL(nodes, edges);
        }
    }, [nodes, edges, metadata.dbType, open]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const getThemeStyles = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'dark':
                return {
                    container: 'bg-slate-900 border-slate-700',
                    header: 'bg-slate-900 border-slate-700',
                    text: 'text-slate-100',
                    border: 'border-slate-800',
                    codeBg: 'bg-slate-950',
                    codeText: 'text-blue-300',
                    footerText: 'text-slate-500',
                    button: 'text-slate-400 hover:text-slate-200',
                    closeButton: 'text-slate-400 hover:text-red-400'
                };
            case 'ocean':
                return {
                    container: 'bg-white border-cyan-100',
                    header: 'bg-cyan-50/50 border-cyan-100',
                    text: 'text-cyan-900',
                    border: 'border-cyan-100',
                    codeBg: 'bg-cyan-50',
                    codeText: 'text-cyan-900',
                    footerText: 'text-cyan-400',
                    button: 'text-cyan-600 hover:text-cyan-900',
                    closeButton: 'text-cyan-400 hover:text-red-400'
                };
            case 'sunset':
                return {
                    container: 'bg-white border-orange-100',
                    header: 'bg-orange-50/50 border-orange-100',
                    text: 'text-orange-900',
                    border: 'border-orange-100',
                    codeBg: 'bg-orange-50',
                    codeText: 'text-orange-900',
                    footerText: 'text-orange-400',
                    button: 'text-orange-600 hover:text-orange-900',
                    closeButton: 'text-orange-400 hover:text-red-400'
                };
            default:
                return {
                    container: 'bg-white border-gray-200',
                    header: 'bg-gray-50 border-gray-100',
                    text: 'text-gray-900',
                    border: 'border-gray-100',
                    codeBg: 'bg-gray-50',
                    codeText: 'text-gray-800',
                    footerText: 'text-gray-400',
                    button: 'text-gray-500 hover:text-gray-900',
                    closeButton: 'text-gray-500 hover:text-red-400'
                };
        }
    };

    const styles = getThemeStyles();

    return (
        <div
            className={cn(
                "fixed right-0 top-0 bottom-0 w-[400px] shadow-2xl transform transition-transform duration-300 z-40 flex flex-col pointer-events-auto border-l",
                open ? "translate-x-0" : "translate-x-full",
                styles.container
            )}
        >
            {/* Header */}
            <div className={cn(
                "p-4 border-b flex items-center justify-between transition-colors",
                styles.header
            )}>
                <h3 className={cn("font-semibold", styles.text)}>
                    {metadata.dbType === 'MONGODB' ? 'Mongoose Schemas' : 'MySQL Script'}
                </h3>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                        className={styles.button}
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <pre className={cn(
                    "text-xs font-mono p-4 rounded-lg overflow-x-auto transition-colors",
                    styles.codeBg,
                    styles.codeText
                )}>
                    <code>{code}</code>
                </pre>
            </div>

            {/* Footer */}
            <div className={cn(
                "p-3 text-xs text-center border-t opacity-50 transition-colors",
                styles.border,
                styles.footerText
            )}>
                Generated automatically based on current diagram
            </div>
        </div>
    );
}
