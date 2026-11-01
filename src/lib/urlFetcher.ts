export interface ExtractedSection {
  id: string;
  name: string;
  tag: string;
  snippet: string;
  previewText: string;
}

export interface UrlFetchResult {
  url: string;
  fullHtml: string;
  extractedStyles: string;
  sections: ExtractedSection[];
}

/**
 * Fetches HTML from a public URL using free, open CORS proxies
 */
export async function fetchWebsiteHtml(rawUrl: string): Promise<string> {
  let targetUrl = rawUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }

  const encoded = encodeURIComponent(targetUrl);
  const proxies = [
    `https://api.allorigins.win/get?url=${encoded}`,
    `https://corsproxy.io/?url=${encoded}`,
    `https://api.codetabs.com/v1/proxy?quest=${encoded}`,
  ];

  let lastError: Error | null = null;

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        },
      });

      if (!response.ok) {
        continue;
      }

      if (proxyUrl.includes('allorigins.win')) {
        const json = await response.json();
        if (json.contents) {
          return json.contents;
        }
      } else {
        const text = await response.text();
        if (text && text.length > 50) {
          return text;
        }
      }
    } catch (err) {
      lastError = err as Error;
    }
  }

  throw new Error(
    lastError?.message ||
    'Could not fetch website HTML due to remote site CORS or bot protection. Please use the 1-Click Bookmarklet instead!'
  );
}

/**
 * Parses fetched HTML and extracts identifiable UI component sections (Header, Hero, Cards, Footer)
 */
export function extractSectionsFromHtml(html: string): ExtractedSection[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Collect all styles
  let styles = '';
  doc.querySelectorAll('style').forEach(s => {
    styles += `\n${s.textContent || ''}`;
  });

  const sections: ExtractedSection[] = [];
  let sectionCounter = 1;

  function addSection(el: Element, name: string) {
    const clone = el.cloneNode(true) as Element;
    // Strip script and iframe tags
    clone.querySelectorAll('script, iframe, noscript').forEach(n => n.remove());

    const snippet = `<style>${styles}\n</style>\n${clone.outerHTML}`;
    const preview = el.textContent?.trim().slice(0, 100) || name;

    sections.push({
      id: `sec_${sectionCounter++}`,
      name,
      tag: el.tagName.toLowerCase(),
      snippet,
      previewText: preview,
    });
  }

  // 1. Navigation / Header
  const header = doc.querySelector('header, nav, [role="navigation"], [class*="nav"], [class*="header"]');
  if (header) {
    addSection(header, 'Navigation Bar');
  }

  // 2. Hero Section
  const hero = doc.querySelector('[class*="hero"], [id*="hero"], main section:first-of-type, body > section:first-of-type');
  if (hero && hero !== header) {
    addSection(hero, 'Hero Section');
  }

  // 3. Feature / Cards grid
  const cards = doc.querySelector('[class*="card"], [class*="grid"], [class*="feature"]');
  if (cards && cards !== header && cards !== hero) {
    addSection(cards, 'Feature Component');
  }

  // 4. Footer
  const footer = doc.querySelector('footer, [role="contentinfo"], [class*="footer"]');
  if (footer && footer !== header && footer !== hero) {
    addSection(footer, 'Footer');
  }

  // 5. Fallback: Main or Body
  const main = doc.querySelector('main') || doc.body;
  if (main && sections.length === 0) {
    addSection(main, 'Primary Section');
  }

  return sections;
}
