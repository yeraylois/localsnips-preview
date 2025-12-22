/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : ItemDetail.tsx                                 *
 *   Purpose : DETAILED ITEM VIEW & METADATA EDITOR           *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { Copy, RefreshCw, Trash2, ShieldAlert, CheckCircle2, Sparkles, Image as ImageIcon, FileText, Code } from "lucide-react";
import { Item } from "../lib/types";
import { useTheme } from "./ThemeProvider";
import { detectTechnology, getTechIconUrl, TECH_ICONS } from "../lib/tech-icons";
import TechDropdown from "./TechDropdown";
import TechIcon from "./TechIcon";
import DiffModal from "./DiffModal";
import SnapshotModal from "./SnapshotModal";
import PosterModal from "./PosterModal";
import AlertModal from "./AlertModal";

type Conflict = { candidate_id: string; similarity: number; candidate: Item };

/**
 * MAIN VIEW FOR DISPLAYING AND EDITING A SNIPPET.
 * INCLUDES TABS FOR DOCUMENTATION, RAW CONTENT, AND METADATA EDITING.
 * ALSO MANAGES MODALS FOR CONFLICTS, SNAPSHOTS, AND DELETION.
 * - Parameter item: Current item stub (from list)
 * - Parameter onMutated: Callback to refresh parent list after changes
 */
export default function ItemDetail({ item, onMutated }: { item: Item | null; onMutated: () => void }) {
  const [full, setFull] = useState<Item | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [showConflict, setShowConflict] = useState(false);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showRetryAlert, setShowRetryAlert] = useState(false);
  const [tab, setTab] = useState<"doc" | "raw" | "meta">("doc");
  const { theme } = useTheme();
  
  // DETECT TECHNOLOGY - PREFER AI SUGGESTION, FALLBACK TO CLIENT-SIDE DETECTION
  const techInfo = useMemo(() => {
    if (!full) return null;
    
    // IF AI PROVIDED A TECHNOLOGY, USE IT
    if (full.technology) {
      // IMPORT FROM TECH-ICONS TO GET COLOR/SLUG
      const { TECH_ICONS } = require("../lib/tech-icons");
      const techData = TECH_ICONS[full.technology];
      if (techData) {
        return { name: full.technology, ...techData };
      }
      // IF NOT IN OUR DATABASE, STILL USE THE SLUG
      return { name: full.technology, slug: full.technology, color: "#6b7280" };
    }
    
    // FALLBACK TO CLIENT-SIDE DETECTION
    return detectTechnology(full.collection, full.tags);
  }, [full?.technology, full?.collection, full?.tags]);

  // MOCK: USE ITEM DIRECTLY INSTEAD OF FETCHING FROM API
  useEffect(() => {
    if (!item) {
      setFull(null);
      setConflicts([]);
      return;
    }
    // In preview mode, the item passed already has all the data
    setFull(item);
    
    // Check for mock conflicts
    if (item.status === "conflict_pending") {
      // Import mock conflicts
      import("../lib/mock-data").then(({ MOCK_CONFLICTS }) => {
        const itemConflicts = (MOCK_CONFLICTS as any)[item.id];
        if (itemConflicts) setConflicts(itemConflicts);
      });
    } else {
      setConflicts([]);
    }
  }, [item?.id]);

  // CLEAN MARKDOWN LOGIC
  const html = useMemo(() => {
    if (!full?.doc_markdown) return "";
    let md = full.doc_markdown;
    md = md.replace(/##\s+Related\s*\n+(N\/A|None|-|)\s*(\n|$)/gi, "");
    md = md.replace(/##\s+Unknown\s*\n/gi, "");
    md = md.replace(/##\s+\w+\s*$/, "");
    return marked.parse(md) as string; // Cast for sync usage
  }, [full?.doc_markdown]);

  if (!item) return <div className="p-8 text-sm text-surface-500 text-center">Select an item to view details.</div>;
  if (!full) return <div className="p-8 text-sm text-surface-500 text-center">Loading Content...</div>;

  async function patchMeta(p: Partial<Item>) {
    const r = await fetch(`/api/items/${full!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    if (r.ok) {
      setFull(await r.json());
      onMutated(); 
    }
  }

  async function rerun() {
    await fetch(`/api/items/${full!.id}/rerun`, { method: "POST" });
    onMutated();
  }

  async function deleteItem() {
    setShowDeleteAlert(true);
  }

  const hasConflicts = full.status === "conflict_pending";

  return (
    <div className="h-full flex flex-col min-w-0 bg-white dark:bg-surface-950">
      {/* HEADER */}
      <div className="border-b border-surface-200 dark:border-surface-800 px-6 py-4 bg-surface-50/30 dark:bg-surface-900/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* TECH ICON */}
            <TechIcon 
              technology={full.technology}
              title={full.title}
              size="md"
            />
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 truncate">
               {full.title || <span className="text-surface-400 italic">Untitled Note</span>}
            </h2>
            {full.kind && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-surface-200 dark:bg-surface-800 text-surface-600 dark:text-surface-400 tracking-wider">
                    {full.kind}
                </span>
            )}
          </div>
        </div>
        <div className="text-xs text-surface-500 mt-1 flex gap-2">
           <span>{full.collection ?? "No Collection"}</span>
           <span>·</span>
           <span>{(full.confidence ?? 0) * 100}% AI Confidence</span>
        </div>
      </div>

      {/* TABS + ACTIONS */}
      <div className="px-6 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-6">
          <button 
              onClick={() => setTab("doc")}
              className={`py-3 border-b-2 transition-colors ${tab === "doc" ? "border-brand-600 text-brand-700 dark:text-brand-400" : "border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"}`}
          >
              Documentation
          </button>
          <button 
              onClick={() => setTab("raw")}
              className={`py-3 border-b-2 transition-colors ${tab === "raw" ? "border-brand-600 text-brand-700 dark:text-brand-400" : "border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"}`}
          >
              Raw Content
          </button>
          <button 
              onClick={() => setTab("meta")}
              className={`py-3 border-b-2 transition-colors ${tab === "meta" ? "border-brand-600 text-brand-700 dark:text-brand-400" : "border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"}`}
          >
              Metadata
          </button>
        </div>
        
        {/* ACTIONS - MOVED TO TABS ROW */}
        <div className="flex items-center gap-1">
          {hasConflicts && (
            <button
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-500/30 font-medium transition-colors mr-2"
              onClick={() => setShowConflict(true)}
            >
              <ShieldAlert className="w-3 h-3" />
              {conflicts.length > 0 ? "Resolve" : "Stale Conflict"}
            </button>
          )}
          <button 
              className="p-1.5 rounded-md text-surface-400 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" 
              onClick={() => setShowSnapshot(true)}
              data-tooltip="Create Code Snapshot"
          >
              <ImageIcon className="w-4 h-4" />
          </button>
          <button 
              className="p-1.5 rounded-md text-surface-400 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" 
              onClick={() => setShowPoster(true)}
              data-tooltip="Generate Poster PDF"
          >
              <FileText className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 rounded-md text-surface-400 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-surface-900 dark:hover:text-surface-100 transition-colors" 
            onClick={() => setShowRetryAlert(true)}
            data-tooltip="Re-process with AI"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-surface-200 dark:bg-white/10 mx-1"></div>
          <button 
            className="p-1.5 rounded-md text-surface-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors" 
            onClick={deleteItem}
            data-tooltip="Delete Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto p-8 min-w-0">
        {tab === "doc" && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            {full.doc_markdown ? (
              <div className="bg-white dark:bg-[#1a1a1c] rounded-2xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-surface-200/60 dark:border-white/5 overflow-hidden">
                {/* WINDOW-STYLE HEADER */}
                <div className="px-5 py-3 bg-surface-50/80 dark:bg-[#252527] border-b border-surface-200/50 dark:border-white/5 flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    </div>
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400 flex-1 text-center -ml-12 truncate">
                        {full.title || "Documentation"}
                    </span>
                </div>
                
                {/* DOCUMENTATION CONTENT */}
                <div className="p-6 md:p-8 bg-white dark:bg-[#1a1a1c]">
                  <div 
                    className="prose prose-sm dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-surface-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-p:text-surface-700 dark:prose-p:text-surface-300 prose-a:text-brand-500 dark:prose-a:text-brand-400 hover:prose-a:underline prose-strong:text-surface-900 dark:prose-strong:text-white prose-code:text-brand-600 dark:prose-code:text-brand-400 prose-code:text-xs prose-code:font-medium prose-pre:bg-[#0d0d0d] prose-pre:text-surface-200 prose-pre:text-xs prose-pre:rounded-xl prose-pre:border prose-pre:border-white/5 prose-li:my-1 prose-li:text-surface-700 dark:prose-li:text-surface-300 prose-ul:my-2 prose-ol:my-2 prose-hr:border-surface-200 dark:prose-hr:border-white/10 prose-blockquote:border-brand-500 prose-blockquote:text-surface-600 dark:prose-blockquote:text-surface-400 max-w-none"
                    dangerouslySetInnerHTML={{ __html: html }} 
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-surface-400 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-2xl bg-surface-50/50 dark:bg-surface-900/30">
                 <RefreshCw className="w-8 h-8 mb-4 animate-spin-slow opacity-50"/>
                 <p className="font-medium">AI is processing this note...</p>
                 <p className="text-xs text-surface-400 mt-2">Check the sidebar for status.</p>
              </div>
            )}
          </div>
        )}

        {tab === "raw" && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white dark:bg-[#1a1a1c] rounded-2xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-surface-200/60 dark:border-white/5 overflow-hidden">
              {/* WINDOW-STYLE HEADER */}
              <div className="px-5 py-3 bg-surface-50/80 dark:bg-[#252527] border-b border-surface-200/50 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                      </div>
                      <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                          Raw Content
                      </span>
                  </div>
                  <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-600 dark:text-surface-300 text-xs font-medium transition-colors"
                      onClick={async () => { await navigator.clipboard.writeText(full.raw_content); }}
                  >
                      <Copy className="w-3 h-3"/> Copy
                  </button>
              </div>
              
              {/* RAW CONTENT */}
              <div className="p-0">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words p-6 text-surface-800 dark:text-surface-200 bg-white dark:bg-[#1a1a1c] leading-relaxed overflow-auto max-h-[600px]">
                    {full.raw_content}
                </pre>
              </div>
              
              {/* FOOTER WITH LINE COUNT */}
              <div className="px-5 py-2 bg-surface-50/80 dark:bg-[#252527] border-t border-surface-200/50 dark:border-white/5 flex items-center justify-between text-[10px] text-surface-400 dark:text-surface-500">
                  <span>{full.raw_content?.length ?? 0} characters</span>
                  <span>{full.raw_content?.split('\n').length ?? 0} lines</span>
              </div>
            </div>
          </div>
        )}

        {tab === "meta" && (
          <MetaEditor item={full} onPatch={patchMeta} onMutated={onMutated} />
        )}
      </div>

      {showConflict && hasConflicts && (
        <DiffModal
          item={full}
          conflicts={conflicts}
          onClose={() => setShowConflict(false)}
          onResolved={() => { setShowConflict(false); onMutated(); }}
        />
      )}

      {showSnapshot && full && (
        <SnapshotModal 
            item={full} 
            onClose={() => setShowSnapshot(false)} 
        />
      )}

      {showPoster && full && (
        <PosterModal
            item={full}
            open={showPoster}
            onClose={() => setShowPoster(false)}
        />
      )}

      <AlertModal
        isOpen={showRetryAlert}
        onClose={() => setShowRetryAlert(false)}
        onConfirm={() => {
          rerun();
          setShowRetryAlert(false);
        }}
        title="Reprocess with AI?"
        description="This will overwrite existing AI-generated metadata for this snippet. This action cannot be undone."
        confirmText="Reprocess"
        cancelText="Cancel"
        isDestructive={false}
        Icon={RefreshCw}
      />

      <AlertModal
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={async () => {
          if (full) {
             await fetch(`/api/items/${full.id}`, { method: "DELETE" });
             onMutated();
             setShowDeleteAlert(false);
          }
        }}
        title="Delete Snippet"
        description={`Are you sure you want to delete "${full?.title || 'Untitled Note'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}

function MetaEditor({
  item,
  onPatch,
  onMutated
}: {
  item: Item;
  onPatch: (p: Partial<Item>) => Promise<void>;
  onMutated: () => void;
}) {
  const { theme } = useTheme();
  const [collection, setCollection] = useState(item.collection ?? "");
  const [technology, setTechnology] = useState<string | null>(item.technology ?? null);
  const [tags, setTags] = useState((item.tags ?? []).join(", "));
  const [title, setTitle] = useState(item.title ?? "");
  const [isSaved, setIsSaved] = useState(false);

  // COMPUTED STYLE FOR AI SUGGEST BUtTONS - SYNCS WITH ACCENT COLOR IN ALL MODES
  const aiSuggestStyle: React.CSSProperties = {
    backgroundColor: 'color-mix(in srgb, var(--brand-500) 15%, transparent)',
    color: 'var(--brand-600)'
  };

  // AI SUGGESTION LOGIC - COLLECTION
  const hasSuggestion = !item.collection && item.suggested_collection;
  const suggestedCollection = item.suggested_collection;

  // AI SUGGESTION LOGIC - TECHNOLOGY
  // USE AI SUGGESTION OR FALLBACK TO CLIENT-SIDE DETECTION FROM COLLECTION/TAGS
  const detectedTech = useMemo(() => {
    if (!item) return null;
    return detectTechnology(item.collection, item.tags);
  }, [item?.collection, item?.tags]);
  
  const suggestedTechnology = item.suggested_technology || detectedTech?.name || null;
  const hasTechSuggestion = !technology && suggestedTechnology;

  // DERIVE DYNAMIC COLOR FOR THE TECH BUTTON
  const suggestedTechData = useMemo(() => {
    if (!suggestedTechnology) return null;
    return TECH_ICONS[suggestedTechnology.toLowerCase()] || null;
  }, [suggestedTechnology]);

  // TECH BUTTON CAN OPTIONALLY USE THE TECHNOLOGY'S BRAND COLOR IF DETECTED
  const techButtonStyle: React.CSSProperties = suggestedTechData?.color ? {
    backgroundColor: `${suggestedTechData.color}20`, // 12% opacity
    color: 'var(--brand-600)'
  } : (aiSuggestStyle ?? {});

  async function save() {
    const cleanTags = tags.split(",").map(s => s.trim()).filter(Boolean);
    await onPatch({ collection: collection || null, technology, tags: cleanTags, title: title || null });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  function applySuggestion() {
      if (suggestedCollection) {
          setCollection(suggestedCollection);
      }
  }

  function applyTechSuggestion() {
      if (suggestedTechnology) {
          setTechnology(suggestedTechnology);
      }
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1a1a1c] rounded-2xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-surface-200/60 dark:border-white/5 overflow-hidden">
        {/* WINDOW-STYLE HEADER */}
        <div className="px-5 py-3 bg-surface-50/80 dark:bg-[#252527] border-b border-surface-200/50 dark:border-white/5 flex items-center gap-3">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
            </div>
            <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                Metadata Editor
            </span>
        </div>
        
        {/* FORM CONTENT */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wider">Title</label>
              <input
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/30 outline-none transition-all text-sm bg-surface-50 dark:bg-white/5 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give this snippet a name..."
              />
          </div>
          
          <div className="space-y-2">
              <div className="flex items-center justify-between">
                   <label className="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wider">Collection</label>
                   {hasSuggestion && !collection && (
                       <button 
                          onClick={applySuggestion}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors bg-brand-500/10 dark:bg-brand-500/20 hover:bg-brand-500/20 dark:hover:bg-brand-500/30 text-brand-600 dark:text-brand-400"
                          style={aiSuggestStyle}
                          data-tooltip={`AI Suggestion: ${suggestedCollection}`}
                       >
                           <Sparkles className="w-3 h-3" />
                           AI Suggest: <strong>{suggestedCollection}</strong>
                       </button>
                   )}
              </div>
              <div className="relative">
                  <input
                      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/30 outline-none transition-all text-sm bg-surface-50 dark:bg-white/5 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500"
                      value={collection}
                      onChange={e => setCollection(e.target.value)}
                      placeholder={hasSuggestion ? `Suggested: ${suggestedCollection}` : "Folder/Subfolder (e.g. Linux/Commands)"}
                  />
              </div>
              <p className="text-[11px] text-surface-400 dark:text-surface-500 pl-1">Use "/" to create nested categories</p>
          </div>

          <div className="space-y-2">
              <div className="flex items-center justify-between">
                   <label className="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wider">Technology</label>
                   {hasTechSuggestion && !technology && (
                       <button 
                          onClick={applyTechSuggestion}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors bg-brand-500/10 dark:bg-brand-500/20 hover:bg-brand-500/20 dark:hover:bg-brand-500/30 text-brand-600 dark:text-brand-400"
                          style={aiSuggestStyle}
                          data-tooltip={`AI Suggestion: ${suggestedTechnology}`}
                       >
                           <Sparkles className="w-3 h-3" />
                           AI Suggest: <strong className="capitalize">{suggestedTechnology}</strong>
                       </button>
                   )}
              </div>
              <TechDropdown 
                value={technology}
                onChange={setTechnology}
              />
              <p className="text-[11px] text-surface-400 dark:text-surface-500 pl-1">
                {hasTechSuggestion && !technology 
                  ? `AI suggests: ${suggestedTechnology}` 
                  : "Primary technology or framework for this snippet"}
              </p>
          </div>

          <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wider">Tags</label>
              <input
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/30 outline-none transition-all text-sm bg-surface-50 dark:bg-white/5 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="comma, separated, values"
              />
          </div>
        </div>
        
        {/* FOOTER WITH ACTIONS */}
        <div className="px-6 py-4 bg-surface-50/80 dark:bg-[#252527] border-t border-surface-200/50 dark:border-white/5">
          <div className="flex items-center justify-between">
            {/* LEFT SIDE: STATUS INFO */}
            <div className="flex items-center gap-3">
              {item.no_ai && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-surface-100 dark:bg-white/5 text-surface-500 dark:text-surface-400 font-medium uppercase tracking-wider">
                  AI off
                </span>
              )}
              <span className="text-[11px] text-surface-400 dark:text-surface-500">
                Updated {new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            {/* RIGHT SIDE: SAVE BUTTON */}
            <button 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98] ${
                isSaved 
                  ? 'bg-brand-500 text-white' 
                  : 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-100'
              }`}
              onClick={save}
              disabled={isSaved}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
