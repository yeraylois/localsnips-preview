/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : types.ts                                       *
 *   Purpose : CORE DATA TYPES & SHARED CONSTANTS             *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

/**
 * URL PREFIX FOR ASSETS, ADJUSTS FOR PRODUCTION/DEVELOPMENT ENVS.
 */
export const ASSET_PREFIX = process.env.NODE_ENV === 'production' ? '/localsnips-preview' : '';

/**
 * CORE SNIPPET ITEM MODEL.
 * REPRESENTS A SINGLE CODE SNIPPET OR NOTE WITH METADATA AND AI ANALYSIS.
 */
export type Item = {
  id: string;
  created_at: string;
  updated_at: string;

  source_type: "paste" | "file_import";
  original_filename: string | null;

  raw_content: string;
  raw_sha256: string;

  kind: "snippet" | "note" | "config" | "runbook" | "unknown";
  language: string | null;
  confidence: number | null;

  collection: string | null;
  suggested_collection: string | null;
  technology: string | null;
  suggested_technology: string | null;
  tags: string[];
  title: string | null;
  summary: string | null;
  doc_markdown: string | null;

  commands: string[];
  prerequisites: string[];
  warnings: string[];

  status: string; // QUEUED|PROCESSING|DONE|FAILED|BLOCKED|CONFLICT_PENDING
  no_ai: boolean;
  last_error: string | null;
};
