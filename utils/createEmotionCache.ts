import createCache from '@emotion/cache';
import { EmotionCache } from '@emotion/cache';

export default function createEmotionCache(): EmotionCache {
  return createCache({ key: 'css', prepend: true });
}