/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : Sidebar.tsx                                    *
 *   Purpose : APPLICATION SIDEBAR NAVIGATION AND FILTERS     *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useState, useMemo } from "react";
// PREVIEW: Use mock data instead of SWR
import { MOCK_COLLECTIONS, MOCK_TAGS } from "../lib/mock-data";
import { useTheme } from "./ThemeProvider";
import { 
  ChevronDown, 
  ChevronRight, 
  Inbox, 
  Layers, 
  Tag as TagIcon, 
  Clock,
  FolderOpen,
  Trash2,
  Network,
  Octagon
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import AlertModal from "./AlertModal";

type Filter =
  | { kind: "inbox" }
  | { kind: "recent" }
  | { kind: "collection"; value: string }
  | { kind: "tag"; value: string }
  | { kind: "all" }
  | { kind: "settings" }
  | { kind: "quickControls" };

// SIMPLE SWR FETCHER
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// COLLECTION TREE NODE TYPE
type CollectionNode = {
  name: string;      // SEGMENT NAME (E.G. "COMMANDS")
  fullPath: string;  // FULL PATH (E.G. "LINUX/COMMANDS")
  count: number;     // SELF COUNT
  totalCount: number;// ACCUMULATED COUNT (SELF + CHILDREN)
  children: CollectionNode[];
};

/**
 * PRIMARY NAVIGATION COMPONENT.
 * RENDERS INBOX, LIBRARY, COLLECTIONS TREE, TAGS, AND STACK CONTROLS.
 * USES SWR FOR REAL-TIME UPDATES OF COUNTS AND FACETS.
 * - Parameter status: Current system status (queue count, running state)
 * - Parameter onPickFilter: Callback to change the active view filter
 * - Parameter active: Currently selected filter
 */
export default function Sidebar({
  status,
  onPickFilter,
  active,
}: {
  status: { state: string; counts: Record<string, number> } | null;
  onPickFilter: (f: Filter) => void;
  active: Filter;
}) {
  // PREVIEW: Use mock facets instead of API
  const facets = { collections: MOCK_COLLECTIONS, tags: MOCK_TAGS };
  const { theme } = useTheme();
  
  // Transform mock collections to flat format expected by tree builder
  const flattenCollections = (nodes: any[]): { name: string; count: number }[] => {
    const result: { name: string; count: number }[] = [];
    const traverse = (node: any) => {
      result.push({ name: node.fullPath, count: node.count });
      node.children?.forEach(traverse);
    };
    nodes.forEach(traverse);
    return result;
  };
  
  const collectionsRaw = flattenCollections(facets?.collections ?? []);
  // Transform mock tags: { text, count } -> { name, count }
  const tags = (facets?.tags ?? []).map((t: any) => ({ name: t.text, count: t.count }));

  // SECTION COLLAPSE STATE
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  // BUILD COLLECTION TREE
  const collectionTree = useMemo(() => {
    const root: CollectionNode[] = [];
    
    // HELPER TO FIND OR CREATE NODE
    const findOrCreate = (nodes: CollectionNode[], segment: string, fullPath: string): CollectionNode => {
      let node = nodes.find(n => n.name === segment);
      if (!node) {
        node = { name: segment, fullPath, count: 0, totalCount: 0, children: [] };
        nodes.push(node);
      }
      return node;
    };

    collectionsRaw.forEach(c => {
      const parts = c.name.split("/").filter(Boolean);
      let currentLevel = root;
      
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        // RECONSTRUCT PATH UP TO HERE
        const currentPath = parts.slice(0, index + 1).join("/");
        
        const node = findOrCreate(currentLevel, part, currentPath);
        
        // ADD TO TOTAL COUNT OF ALL PARENTS TRAVERSED
        node.totalCount += c.count; // SIMPLIFICATION: SIMPLE SUM
        
        if (isLast) {
          node.count = c.count; // REAL COUNT OF EXACT ITEM
        }
        
        currentLevel = node.children;
      });
    });

    // ALPHABETICAL SORT
    const sortNodes = (nodes: CollectionNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach(n => sortNodes(n.children));
    };
    sortNodes(root);

    return root;
  }, [collectionsRaw]);

  // RECURSIVE FUNCTION TO RENDER COLLECTION TREE
  const CollectionTreeItem = ({ node, level }: { node: CollectionNode, level: number }) => {
    const [isOpen, setIsOpen] = useState(false); // COLLAPSED BY DEFAULT
    const hasChildren = node.children.length > 0;
    const isActiveNode = isActive("collection", node.fullPath);
    
    // AUTO-EXPAND IF CHILD IS ACTIVE (OPTIONAL, SKIPPED FOR SIMPLICITY)

    return (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center w-full group">
           {/* EXPANSION BUTTON FOR PARENTS */}
           {hasChildren ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="p-1 text-surface-400 hover:text-surface-700 transition-colors"
                style={{ marginLeft: (level * 12) + "px" }}
              >
                 {isOpen ? <ChevronDown className="w-3 h-3"/> : <ChevronRight className="w-3 h-3"/>}
              </button>
           ) : (
              // SPACER FOR ALIGNMENT
              <div style={{ width: "20px", marginLeft: (level * 12) + "px" }} />
           )}

           <div
            onClick={() => onPickFilter({ kind: "collection", value: node.fullPath })}
            className={clsx(
                "flex-1 flex items-center px-2 py-1.5 rounded-lg text-sm transition-colors text-left cursor-pointer group/item relative",
                isActiveNode
                  ? "bg-brand-50 text-brand-700 font-medium" 
                  : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
            )}
            data-tooltip={node.fullPath}
          >
            <FolderOpen className={clsx("w-3.5 h-3.5 mr-2 shrink-0", isActiveNode ? "text-brand-500" : "text-surface-400")} />
            <span className="truncate flex-1">{node.name}</span>
            
            <button
                className="p-1 text-surface-400 hover:text-red-500 rounded opacity-0 group-hover/item:opacity-100 transition-opacity mr-1"
                onClick={(e) => {
                    e.stopPropagation();
                    setAlertConfig({
                        isOpen: true,
                        title: "Delete Collection",
                        description: `The collection "${node.fullPath}" and all contained items will be deleted. This action cannot be undone.`,
                        onConfirm: () => {
                            fetch(`/api/collections?name=${encodeURIComponent(node.fullPath)}`, { method: "DELETE" })
                            .then(() => window.location.reload()); 
                        }
                    });
                }}
                data-tooltip="Delete Collection"
            >
                <Trash2 className="w-3 h-3" />
            </button>

            {badge(node.count > 0 ? node.count : undefined)} 
          </div>
        </div>

        {hasChildren && isOpen && (
            <div className="flex flex-col gap-0.5">
                {node.children.map(child => (
                    <CollectionTreeItem key={child.fullPath} node={child} level={level + 1} />
                ))}
            </div>
        )}
      </div>
    );
  };


  function isActive(k: string, v?: string) {
    if (active.kind !== k) return false;
    if (v && (active as any).value !== v) return false;
    return true;
  }

  const badge = (n?: number) =>
    typeof n === "number" && n > 0 ? (
      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-surface-200 dark:bg-surface-800 text-surface-600 dark:text-surface-300 font-medium min-w-[20px] text-center">{n}</span>
    ) : null;

  const NavItem = ({ 
    icon: Icon, 
    label, 
    count, 
    active, 
    onClick 
  }: { 
    icon?: any; 
    label: string; 
    count?: number; 
    active?: boolean; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center w-full px-2 py-1.5 rounded-lg text-sm transition-all group cursor-pointer select-none", 
        active 
          ? "bg-white dark:bg-surface-800 shadow-sm text-surface-900 dark:text-white" 
          : "text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white"
      )}
    >
      {Icon && <Icon className={clsx("w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity", active && "opacity-100 text-brand-600 dark:text-white")} />}
      <span className="truncate">{label}</span>
      {badge(count)}
    </button>
  );

  // ALERT STATE
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    Icon?: React.ElementType;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Delete",
    Icon: undefined,
    onConfirm: () => {},
  });

  return (
    <>
      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText={alertConfig.confirmText || "Delete"}
        Icon={alertConfig.Icon}
        isDestructive
      />
      
      <div className="flex flex-col gap-1 h-full select-none overflow-y-auto pr-1 custom-scrollbar">
      
      {/* LIBRARY SECTION */}
      <div className="px-2 mb-4">
        <button 
            onClick={() => setLibraryOpen(!libraryOpen)}
            className="flex items-center w-full px-3 py-1 text-xs font-semibold text-surface-400 uppercase tracking-widest hover:text-surface-600 transition-colors mb-1"
            style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}
        >
             {libraryOpen ? <ChevronDown className="w-3 h-3 mr-1"/> : <ChevronRight className="w-3 h-3 mr-1"/>}
             Library
        </button>
        
        {libraryOpen && (
            <div className="flex flex-col gap-0.5 animate-fade-in pl-1">
                <NavItem 
                    icon={Inbox} 
                    label="Inbox" 
                    count={status?.counts?.inbox} 
                    active={isActive("inbox")} 
                    onClick={() => onPickFilter({ kind: "inbox" })} 
                />
                <NavItem 
                    icon={Clock} 
                    label="Recently Saved" 
                    active={isActive("recent")} 
                    onClick={() => onPickFilter({ kind: "recent" })} 
                />
                 <NavItem 
                    icon={Layers} 
                    label="All items" 
                    count={status?.counts?.all} 
                    active={isActive("all")} 
                    onClick={() => onPickFilter({ kind: "all" })} 
                />
            </div>
        )}
      </div>

      {/* COLLECTIONS TREE SECTION */}
      <div className="px-2 mb-4">
        <div className="flex items-center justify-between mb-1">
            <button 
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="flex items-center px-3 py-1 text-xs font-semibold text-surface-400 uppercase tracking-widest hover:text-surface-600 transition-colors"
                style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}
            >
                {collectionsOpen ? <ChevronDown className="w-3 h-3 mr-1"/> : <ChevronRight className="w-3 h-3 mr-1"/>}
                Collections
            </button>
            <Link 
                href="/collections/graph"
                className="p-1 text-surface-400 hover:text-brand-500 hover:bg-brand-50 rounded transition-colors mr-2 tooltip-left"
                data-tooltip="View Collections Graph"
            >
                <Network className="w-3.5 h-3.5" />
            </Link>
        </div>
        
        {collectionsOpen && (
            <div className="mt-1 flex flex-col gap-0.5 animate-fade-in">
            {collectionTree.map(node => (
                <CollectionTreeItem key={node.fullPath} node={node} level={0} />
            ))}
            {!collectionTree.length && <div className="pl-4 py-2 text-xs text-surface-400 italic">No collections found</div>}
            </div>
        )}
      </div>

      {/* TAGS SECTION */}
      <div className="px-2">
        <button 
            onClick={() => setTagsOpen(!tagsOpen)}
            className="flex items-center w-full px-3 py-1 text-xs font-semibold text-surface-400 uppercase tracking-widest hover:text-surface-600 transition-colors mb-1"
            style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}
        >
            {tagsOpen ? <ChevronDown className="w-3 h-3 mr-1"/> : <ChevronRight className="w-3 h-3 mr-1"/>}
            Tags
        </button>

        {tagsOpen && (
            <div className="mt-1 flex flex-col gap-0.5 animate-fade-in pl-1">
            {tags.slice(0, 40).map(t => (
                <div
                key={t.name}
                onClick={() => onPickFilter({ kind: "tag", value: t.name })}
                className={clsx(
                    "flex items-center w-full px-2 py-1.5 rounded-lg text-sm transition-all group cursor-pointer",
                    isActive("tag", t.name)
                         ? "bg-white dark:bg-surface-800 shadow-sm text-surface-900 dark:text-white"
                         : "text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white"
                )}
                >
                    <TagIcon className={clsx("w-4 h-4 mr-2 shrink-0", isActive("tag", t.name) ? "text-brand-500" : "text-surface-400")} />
                    <span className="truncate flex-1">{t.name}</span>
                    
                    <button
                        className="p-1 text-surface-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity mr-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAlertConfig({
                                isOpen: true,
                                title: "Delete Tag",
                                description: `This tag "${t.name}" will be removed from all items.`,
                                onConfirm: () => {
                                    fetch(`/api/tags?name=${encodeURIComponent(t.name)}`, { method: "DELETE" })
                                    .then(() => window.location.reload()); 
                                }
                            });
                        }}
                        data-tooltip="Delete Tag"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>

                    {badge(t.count)}
                </div>
            ))}
            {!tags.length && <div className="pl-4 py-2 text-xs text-surface-400 italic">No tags found</div>}
            </div>
        )}
      </div>

      {/* QUICK CONTROLS SECTION */}
      <div className="mt-auto px-3 pb-4 pt-4">
        <div className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3" style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}>
          Stack Control
        </div>
        <div className="flex items-center justify-between p-3 bg-surface-100/50 dark:bg-surface-800/30 rounded-xl border border-surface-200/50 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status?.state === 'running' ? 'bg-green-500 animate-pulse' : 'bg-surface-400'}`} />
            <span className="text-xs font-medium text-surface-600 dark:text-surface-300">
              {status?.state === 'running' ? 'Running' : 'Stopped'}
            </span>
          </div>
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status?.state !== 'running'}
            onClick={() => setAlertConfig({
              isOpen: true,
              title: "Stop Stack",
              description: "This will shut down all LocalSnips services. You can restart them from the native app.",
              confirmText: "Stop",
              Icon: Octagon,
              onConfirm: () => {
                // SEND MESSAGE TO NATIVE APP TO STOP STACK
                const win = window as any;
                if (win.webkit?.messageHandlers?.windowControl) {
                  win.webkit.messageHandlers.windowControl.postMessage({ action: "stopStack" });
                }
              }
            })}
          >
            <Octagon className="w-2.5 h-2.5" />
            <span>Stop Stack</span>
          </button>
        </div>
        <div className="mt-2 text-[10px] text-surface-400 opacity-60">
          Queue: {(status?.counts?.active ?? 0)} processing
        </div>
      </div>
    </div>
    </>
  );
}
