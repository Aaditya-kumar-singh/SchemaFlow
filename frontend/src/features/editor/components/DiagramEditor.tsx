import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    Edge,
    ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TableNode from '../nodes/TableNode';
import MysqlTableNode from '../nodes/MysqlTableNode';
import MongoCollectionNode from '../nodes/MongoCollectionNode';
import FieldMappingEdge from './edges/FieldMappingEdge';
import RelationshipEditor from './dialogs/RelationshipEditor';
import SchemaInboxPanel from './dialogs/SchemaInboxPanel';
import { useCanvasStore } from '../stores/canvasStore';
import { Button } from '@/components/ui/button';
import { projectsApi } from '@/features/projects/api/projectsApi';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, FileInput, History, Database, Menu, Braces, Table2, Layers } from 'lucide-react';
import VersionHistoryPanel from './dialogs/VersionHistoryPanel';
import ImportDialog from './ImportDialog';

import { toast } from 'sonner';
import NodeContextMenu from './nodes/NodeContextMenu';
import { cn } from '@/lib/utils/cn';
import { useSmartGuides } from '../hooks/useSmartGuides';
import AlignmentGuides from './AlignmentGuides';
import CanvasEmptyState from './CanvasEmptyState';

import { useCollaboration } from '../hooks/useCollaboration';
import { useAutoSave } from '../hooks/useAutoSave';

interface DiagramEditorProps {
    initialContent?: any;
    projectId: string;
    readOnly?: boolean;
}

export default function DiagramEditor({ initialContent, projectId, readOnly = false }: DiagramEditorProps) {
    // Suppress React Flow handle warnings
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Couldn\'t create edge for target handle id')) {
                return;
            }
            originalError.apply(console, args);
        };
        return () => {
            console.error = originalError;
        };
    }, []);

    useCollaboration(projectId);
    useAutoSave(projectId, !readOnly); // Disable Auto-Save if ReadOnly
    const initialized = useRef(false);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [schemaInboxOpen, setSchemaInboxOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);

    const handleImportFromDb = async (connectionString: string) => {
        try {
            const dbType = metadata?.dbType || 'MYSQL';
            const importedData = await projectsApi.importFromDb(dbType, connectionString);

            // Merge nodes
            if (importedData && importedData.nodes) {
                importedData.nodes.forEach((node: any) => {
                    useCanvasStore.getState().handleLocalEvent({
                        type: 'NODE_ADDED',
                        node: {
                            ...node,
                        },
                        projectId,
                        actorId: 'local',
                        timestamp: Date.now()
                    });
                });
            }

            // Merge edges
            if (importedData && importedData.edges) {
                importedData.edges.forEach((edge: any) => {
                    useCanvasStore.getState().handleLocalEvent({
                        type: 'EDGE_ADDED',
                        edge,
                        projectId,
                        actorId: 'local',
                        timestamp: Date.now()
                    });
                });
            }
        } catch (error: any) {
            console.error('Import failed', error);
            const msg = error.response?.data?.error?.message || error.message || 'Failed to import database';
            toast.error(msg);
        }
    };

    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setInitialContent,
        addTable,
        selectNode,
        selectedNodeId,
        getConnectedElements,
        metadata,
        snapshot, // Undo/Redo
        undo,
        redo,
        searchTerm
    } = useCanvasStore();

    // Search & Filter
    const { displayNodes, displayEdges } = useMemo(() => {
        let activeNodeIds = new Set<string>();
        let activeEdgeIds = new Set<string>();
        let isFiltering = false;

        // By Term
        if (searchTerm && searchTerm.trim().length > 0) {
            isFiltering = true;
            const lowerTerm = searchTerm.toLowerCase();
            nodes.forEach(n => {
                if (n.data.label.toLowerCase().includes(lowerTerm)) {
                    activeNodeIds.add(n.id);
                }
                if (n.data.fields?.some((f: any) => f.name.toLowerCase().includes(lowerTerm))) {
                    activeNodeIds.add(n.id);
                }
            });
        }

        // By Selection
        if (selectedNodeId && !isFiltering) {
            isFiltering = true;
            const { nodeIds, edgeIds } = getConnectedElements(selectedNodeId);
            nodeIds.forEach(id => activeNodeIds.add(id));
            edgeIds.forEach(id => activeEdgeIds.add(id));
        }

        if (!isFiltering) return { displayNodes: nodes, displayEdges: edges };

        const newNodes = nodes.map(n => ({
            ...n,
            style: {
                ...n.style,
                opacity: activeNodeIds.has(n.id) ? 1 : 0.15,
                transition: 'opacity 0.2s ease-in-out'
            }
        }));

        const newEdges = edges.map(e => {
            const isActive = activeEdgeIds.has(e.id) || (activeNodeIds.has(e.source) && activeNodeIds.has(e.target));
            return {
                ...e,
                style: {
                    ...e.style,
                    opacity: isActive ? 1 : 0.05,
                    stroke: isActive ? (e.style?.stroke) : '#e2e8f0',
                },
                animated: isActive ? true : e.animated,
            };
        });

        return { displayNodes: newNodes, displayEdges: newEdges };
    }, [nodes, edges, selectedNodeId, searchTerm, getConnectedElements]);

    const nodeTypes = useMemo(() => ({
        table: TableNode,
        mysqlTable: MysqlTableNode,
        mongoCollection: MongoCollectionNode
    }), []);

    const edgeTypes = useMemo(() => ({
        fieldMapping: FieldMappingEdge,
        default: FieldMappingEdge, // Use FieldMappingEdge as default
    }), []);

    const deleteKeyCode = useMemo(() => ['Backspace', 'Delete'], []);

    const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
        selectNode(node.id);
        setContextMenu(null); // Close context menu on click
    }, [selectNode]);

    const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            nodeId: node.id,
        });
    }, []);

    const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
        setSelectedEdge(edge);
    }, []);

    const onPaneClick = useCallback(() => {
        selectNode(null);
        setContextMenu(null); // Close context menu
    }, [selectNode]);

    // Snapshot state before dragging starts
    const onNodeDragStart = useCallback(() => {
        snapshot();
    }, [snapshot]);

    useEffect(() => {
        if (initialContent && !initialized.current) {
            setInitialContent(initialContent);
            initialized.current = true;
        }
    }, [initialContent, setInitialContent]);

    // Undo/Redo Keyboard Shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Avoid interfering with input text editing
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo();
                    } else {
                        undo();
                    }
                } else if (e.key === 'y') {
                    e.preventDefault();
                    redo();
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);

    const isMongo = metadata?.dbType === 'MONGODB';

    // Theme Backgrounds
    const getThemeBackground = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'ocean':
                return 'bg-gradient-to-br from-cyan-50 to-blue-100/50';
            case 'sunset':
                return 'bg-gradient-to-br from-orange-50 to-rose-100/50';
            case 'dark':
                return 'bg-gradient-to-br from-slate-900 to-slate-800';
            default:
                return 'bg-gradient-to-br from-gray-50 to-gray-100/50';
        }
    };

    const getGridColor = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'ocean': return '#a5f3fc'; // cyan-200
            case 'sunset': return '#fdba74'; // orange-300
            case 'dark': return '#334155'; // slate-700
            default: return '#cbd5e1';
        }
    };

    const getControlsStyle = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'dark': return 'bg-slate-800/80 border-slate-700 shadow-sm !text-white';
            case 'ocean': return 'bg-cyan-50/80 border-cyan-200 shadow-sm text-cyan-900';
            case 'sunset': return 'bg-orange-50/80 border-orange-200 shadow-sm text-orange-900';
            default: return 'bg-white/80 border-gray-200 shadow-sm';
        }
    };

    const getButtonStyle = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'dark': return 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 hover:text-white';
            case 'ocean': return 'bg-white text-cyan-900 border-cyan-200 hover:bg-cyan-50 hover:text-cyan-900';
            case 'sunset': return 'bg-white text-orange-900 border-orange-200 hover:bg-orange-50 hover:text-orange-900';
            default: return 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:text-gray-900';
        }
    };

    const getDropdownStyle = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'dark': return 'bg-slate-800 border-slate-700 text-slate-100';
            case 'ocean': return 'bg-white border-cyan-200 text-cyan-900';
            case 'sunset': return 'bg-white border-orange-200 text-orange-900';
            default: return 'bg-white border-gray-200 text-gray-900';
        }
    };

    const getItemHoverStyle = () => {
        const theme = metadata?.theme || 'default';
        switch (theme) {
            case 'dark': return 'focus:bg-slate-700 focus:text-slate-100';
            case 'ocean': return 'focus:bg-cyan-50 focus:text-cyan-900';
            case 'sunset': return 'focus:bg-orange-50 focus:text-orange-900';
            default: return 'focus:bg-gray-100 focus:text-gray-900';
        }
    };

    const { guides, onNodeDrag, onNodeDragStop } = useSmartGuides();

    return (
        <div className={cn("w-full h-full relative", getThemeBackground())}>
            <ReactFlow
                nodes={displayNodes}
                edges={displayEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeDragStart={onNodeDragStart} // Added
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                className="bg-transparent text-black"
                deleteKeyCode={deleteKeyCode}
                connectionMode={ConnectionMode.Loose}
                snapToGrid={true}
                snapGrid={[15, 15]}
                onlyRenderVisibleElements={true}
                minZoom={0.1}
                maxZoom={4}
            >
                <AlignmentGuides guides={guides} />
                <Controls className={cn("backdrop-blur-sm rounded-lg overflow-hidden !m-4 border", getControlsStyle())} />
                <MiniMap
                    className={cn("!backdrop-blur-sm !rounded-lg !m-4 border", getControlsStyle())}
                    maskColor={metadata?.theme === 'dark' ? "rgba(30, 41, 59, 0.7)" : "rgba(240, 240, 240, 0.6)"}
                    nodeColor={metadata?.theme === 'dark' ? "#475569" : "#e2e8f0"}
                    zoomable
                    pannable
                />
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={getGridColor()} />

                {/* Empty State */}
                {nodes.length === 0 && (
                    <CanvasEmptyState
                        theme={metadata?.theme || 'default'}
                        isMongo={metadata?.dbType === 'MONGODB'}
                        onAdd={addTable}
                        onImport={() => setImportDialogOpen(true)}
                    />
                )}
            </ReactFlow>

            {/* ───── DB-type branded toolbar (top-left) ───── */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">

                {/* Primary CTA: Add Table / Add Collection */}
                <button
                    onClick={addTable}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all active:scale-95',
                        isMongo
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    )}
                    title={isMongo ? 'Add Collection' : 'Add Table'}
                >
                    {isMongo
                        ? <Braces className="w-4 h-4" />
                        : <Table2 className="w-4 h-4" />}
                    {isMongo ? 'Add Collection' : 'Add Table'}
                </button>

                {/* Secondary actions dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={cn("shadow-lg backdrop-blur", getButtonStyle())}>
                            <Menu className="w-4 h-4 mr-2" />
                            More
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className={cn("w-56 ml-2 mt-1 backdrop-blur-xl shadow-xl", getDropdownStyle())}>
                        <DropdownMenuLabel className={cn(
                            'text-xs font-bold uppercase tracking-wide',
                            isMongo ? 'text-emerald-600' : 'text-blue-600'
                        )}>
                            {isMongo ? 'MongoDB Actions' : 'MySQL Actions'}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className={metadata?.theme === 'dark' ? "bg-slate-700" : ""} />
                        <DropdownMenuItem onClick={() => setSchemaInboxOpen(true)} className={cn("cursor-pointer", getItemHoverStyle())}>
                            <FileInput className={cn('w-4 h-4 mr-2', isMongo ? 'text-emerald-500' : 'text-purple-500')} />
                            {isMongo ? 'Import Mongoose Schema' : 'Import SQL Schema'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setImportDialogOpen(true)} className={cn("cursor-pointer", getItemHoverStyle())}>
                            <Database className={cn('w-4 h-4 mr-2', isMongo ? 'text-emerald-500' : 'text-green-500')} />
                            {isMongo ? 'Connect MongoDB' : 'Connect MySQL DB'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className={metadata?.theme === 'dark' ? "bg-slate-700" : ""} />
                        <DropdownMenuItem onClick={() => setHistoryOpen(true)} className={cn("cursor-pointer", getItemHoverStyle())}>
                            <History className="w-4 h-4 mr-2 text-orange-500" />
                            Version History
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ───── Canvas-mode badge (top-right) ───── */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-md backdrop-blur-sm',
                    isMongo
                        ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                        : 'bg-blue-50/90 border-blue-200 text-blue-800'
                )}>
                    {isMongo
                        ? <Braces className="w-3.5 h-3.5 text-emerald-600" />
                        : <Layers className="w-3.5 h-3.5 text-blue-600" />}
                    {isMongo ? 'MongoDB Canvas' : 'MySQL Canvas'}
                </div>
            </div>


            <div className="absolute bottom-4 left-4 z-10 text-xs text-gray-400 pointer-events-none">
                <p>Ctrl+Z to Undo • Ctrl+Y to Redo • Click edge to edit relationship</p>
            </div>

            {/* Relationship Editor Dialog */}
            {selectedEdge && (
                <RelationshipEditor
                    edge={selectedEdge}
                    onClose={() => setSelectedEdge(null)}
                />
            )}

            {/* Schema Inbox Panel */}
            {schemaInboxOpen && (
                <SchemaInboxPanel
                    onClose={() => setSchemaInboxOpen(false)}
                />
            )}

            {/* Version History Panel */}
            {historyOpen && (
                <VersionHistoryPanel
                    projectId={projectId}
                    onClose={() => setHistoryOpen(false)}
                />
            )}
            {/* Import Dialog */}
            {importDialogOpen && (
                <ImportDialog
                    open={importDialogOpen}
                    onClose={() => setImportDialogOpen(false)}
                    onSubmit={handleImportFromDb}
                    dbType={metadata?.dbType || 'MYSQL'}
                />
            )}

            {/* Context Menu */}
            {contextMenu && (
                <NodeContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    nodeId={contextMenu.nodeId}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
}
