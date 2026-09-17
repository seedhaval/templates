/**
 * Copies text safely to clipboard in all environments (browser, iframe, mobile webview).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Haptic feedback for mobile devices (if supported)
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate?.([25]);
    } catch {
      // ignore
    }
  }

  // 1. Try modern navigator.clipboard
  if (navigator?.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard failed, falling back to execCommand', err);
    }
  }

  // 2. Fallback for iframes or restricted web contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed', err);
    return false;
  }
}

/**
 * Share text via native mobile share sheet if available
 */
export async function shareTemplate(text: string, title?: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: title || 'Template Message',
        text: text,
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.warn('Share aborted or failed', err);
      }
    }
  }
  return false;
}
