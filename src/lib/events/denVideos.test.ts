import { expect, it } from 'vitest';
import { youtubeVideoId } from './denVideos';
it('accepts supported YouTube links without forwarding arbitrary embed hosts', () => {
  for (const url of ['https://youtu.be/rop5ZZTanuw?t=12','https://www.youtube.com/watch?v=rop5ZZTanuw&list=test','https://youtube.com/shorts/rop5ZZTanuw']) expect(youtubeVideoId(url)).toBe('rop5ZZTanuw');
  for (const url of ['https://youtube.com.evil.test/watch?v=rop5ZZTanuw','https://evil.test/rop5ZZTanuw','javascript:alert(1)','https://youtube.com/watch?v=bad','garbage']) expect(youtubeVideoId(url)).toBeNull();
});
