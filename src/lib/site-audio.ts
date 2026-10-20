const AUDIO_SRC = '/assets/audio/wicked-grin-theme.ogg';
const STORAGE_KEY = 'wg-audio-muted';

let player: HTMLAudioElement | null = null;

function getPlayer() {
  if (typeof window === 'undefined') return null;
  if (!player) {
    player = new Audio(AUDIO_SRC);
    player.loop = true;
    player.preload = 'auto';
    player.volume = 0.8;
    player.playsInline = true;
  }
  return player;
}

export function getStoredMuted() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function setSiteAudioMuted(muted: boolean) {
  const audio = getPlayer();
  if (!audio) return;
  audio.volume = 0.8;
  audio.muted = muted;
  window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  if (!muted && audio.paused) {
    void audio.play().catch(() => undefined);
  }
}

export function startSiteAudio() {
  const audio = getPlayer();
  if (!audio) return;
  audio.volume = 0.8;
  audio.muted = getStoredMuted();
  if (audio.paused) void audio.play().catch(() => undefined);
}

export function installSiteAudioUnlock() {
  if (typeof window === 'undefined') return () => undefined;
  const unlock = () => {
    startSiteAudio();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('pointerdown', unlock, { passive: true, once: true });
  window.addEventListener('keydown', unlock, { once: true });
  window.addEventListener('touchstart', unlock, { passive: true, once: true });
  return () => {
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
}
