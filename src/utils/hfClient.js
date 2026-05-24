/**
 * Image generation — Pollinations text-to-image
 * Hoàn toàn miễn phí, không cần API key, không giới hạn
 */

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

/**
 * Build URL ảnh từ prompt
 */
export function generateImage(prompt, { width = 1024, height = 1024 } = {}) {
  return (
    `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&nologo=true&seed=${Date.now()}`
  );
}

/**
 * Fetch ảnh thật sự, trả về blob URL khi đã ready
 * Retry tối đa maxRetries lần nếu lỗi
 */
export async function generateImageBlob(
  prompt,
  { width = 1024, height = 1024, maxRetries = 5, retryDelay = 4000 } = {}
) {
  const url =
    `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&nologo=true&seed=${Date.now()}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) throw new Error("Not an image");
      return URL.createObjectURL(blob);
    } catch (err) {
      console.warn(`[Pollinations] Attempt ${attempt} failed:`, err.message);
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, retryDelay));
    }
  }
}