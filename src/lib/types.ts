/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   Purpose : CORE DATA TYPES & SHARED CONSTANTS             *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

export const ASSET_PREFIX = process.env.NODE_ENV === 'production' ? '/localsnips-preview' : '';

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
