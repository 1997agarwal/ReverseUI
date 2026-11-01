import { ingestSnippet, NormalizedNode, IngestedResult } from './domIngestor';
import { extractDesignTokens, ExtractedTokens } from './tokenExtractor';
import { decompileMotion, DecompiledMotion } from './motionDecompiler';
import { synthesizeComponent, SynthesizedResult } from './jsxSynthesizer';

export interface ReverseEngineStats {
  originalCharLength: number;
  outputCharLength: number;
  nodeCount: number;
  semanticTagsInferred: number;
  colorsExtracted: number;
  springsCalculated: number;
  processingTimeMs: number;
}

export interface ReverseEngineResult {
  ingested: IngestedResult;
  tokens: ExtractedTokens;
  motion: DecompiledMotion;
  jsx: SynthesizedResult;
  stats: ReverseEngineStats;
}

/**
 * Main reverse-engineering pipeline combining Engines 1, 2, 3, and 4
 */
export function reverseEngineerSnippet(rawInput: string): ReverseEngineResult {
  const startTime = performance.now();

  // Engine 1: Ingest & Normalize DOM
  const ingested = ingestSnippet(rawInput);

  // Collect all CSS declarations for token extraction
  const allDeclarations: Record<string, string>[] = [];
  ingested.cssRules.forEach(decl => allDeclarations.push(decl));
  ingested.hoverRules.forEach(decl => allDeclarations.push(decl));

  let totalNodes = 0;
  let semanticConvertedCount = 0;

  function countAndCollect(nodes: NormalizedNode[]) {
    for (const n of nodes) {
      totalNodes++;
      if (n.isSemanticConverted) semanticConvertedCount++;
      if (Object.keys(n.inlineStyles).length > 0) {
        allDeclarations.push(n.inlineStyles);
      }
      countAndCollect(n.children);
    }
  }
  countAndCollect(ingested.rootNodes);

  // Engine 2: Token Extractor
  const tokens = extractDesignTokens(allDeclarations);

  // Engine 3: Motion & Physics Decompiler
  const combinedCss = `${ingested.extractedCss}\n${rawInput}`;
  const motion = decompileMotion(combinedCss);

  // Engine 4: Semantic JSX Synthesizer
  const jsx = synthesizeComponent(ingested.rootNodes, combinedCss, 'ReversedComponent');

  const endTime = performance.now();

  const stats: ReverseEngineStats = {
    originalCharLength: rawInput.length,
    outputCharLength: jsx.code.length,
    nodeCount: totalNodes,
    semanticTagsInferred: semanticConvertedCount,
    colorsExtracted: tokens.colors.length,
    springsCalculated: 1,
    processingTimeMs: Math.round((endTime - startTime) * 10) / 10,
  };

  return {
    ingested,
    tokens,
    motion,
    jsx,
    stats,
  };
}
