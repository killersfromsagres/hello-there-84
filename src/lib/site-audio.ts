const TRACK_URL = 'https://soundcloud.com/caspaofficial/caspa-rusko-custard-chucker';
const STORAGE_KEY = 'wg-audio-muted';
const PLAYER_ID = 'wg-background-audio';
const SDK_ID = 'wg-soundcloud-sdk';
const VOLUME = 35;
const MIN_VALID_FINISH_MS = 180_000;

type SoundCloudProgress = { currentPosition?: number };

type SoundCloudWidget = {
  bind: (event: string, handler: (data?: SoundCloudProgress) => void) => void;
  play: () => void;
  seekTo: (milliseconds: number) => void;
  setVolume: (volume: number) => void;
};

type SoundCloudApi = {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: { READY: string; FINISH: string; PLAY_PROGRESS: string };
  };
};

declare global {
  interface Window {
    SC?: SoundCloudApi;
  }
}

let widget: SoundCloudWidget | null = null;
let ready = false;
let requestedStart = false;
let mutedState = false;
let sdkPromise: Promise<void> | null = null;
let lastPositionMs = 0;
let restarting = false;

function ensureIframe() {
  let iframe = document.getElementById(PLAYER_ID) as HTMLIFrameElement | null;
  if (iframe) return iframe;

  iframe = document.createElement('iframe');
  iframe.id = PLAYER_ID;
  iframe.title = 'Trilha sonora Wicked Grin';
  iframe.allow = 'autoplay';
  iframe.tabIndex = -1;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.width = '1px';
  iframe.style.height = '1px';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.left = '-9999px';
  iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACK_URL)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;
  document.body.appendChild(iframe);
  return iframe;
}

function ensureSdk() {
  if (window.SC?.Widget) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SDK_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('SoundCloud SDK unavailable')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SDK_ID;
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('SoundCloud SDK unavailable')), { once: true });
    document.head.appendChild(script);
  });

  return sdkPromise;
}

async function ensureWidget() {
  if (typeof window === 'undefined') return null;
  if (widget) return widget;

  const iframe = ensureIframe();
  await ensureSdk();
  if (!window.SC?.Widget) return null;

  widget = window.SC.Widget(iframe);
  const events = window.SC.Widget.Events;

  widget.bind(events.READY, () => {
    ready = true;
    widget?.setVolume(mutedState ? 0 : VOLUME);
    if (requestedStart) widget?.play();
  });

  widget.bind(events.PLAY_PROGRESS, (data) => {
    const position = Number(data?.currentPosition ?? 0);
    if (Number.isFinite(position) && position >= 0) lastPositionMs = position;
  });

  widget.bind(events.FINISH, () => {
    if (restarting) return;

    // O widget pode disparar FINISH durante a inicialização. Só tratamos como fim real
    // depois que a faixa já avançou por alguns minutos; assim ela não reinicia no começo.
    if (lastPositionMs < MIN_VALID_FINISH_MS) {
      window.setTimeout(() => {
        widget?.setVolume(mutedState ? 0 : VOLUME);
        if (requestedStart) widget?.play();
      }, 350);
      return;
    }

    restarting = true;
    lastPositionMs = 0;
    widget?.seekTo(0);
    widget?.setVolume(mutedState ? 0 : VOLUME);
    window.setTimeout(() => {
      widget?.play();
      restarting = false;
    }, 180);
  });

  return widget;
}

export function getStoredMuted() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function setSiteAudioMuted(muted: boolean) {
  if (typeof window === 'undefined') return;
  mutedState = muted;
  window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  void ensureWidget().then((instance) => {
    instance?.setVolume(muted ? 0 : VOLUME);
    if (ready && requestedStart) instance?.play();
  }).catch(() => undefined);
}

export function startSiteAudio() {
  if (typeof window === 'undefined') return;
  mutedState = getStoredMuted();
  requestedStart = true;
  void ensureWidget().then((instance) => {
    instance?.setVolume(mutedState ? 0 : VOLUME);
    if (ready) instance?.play();
  }).catch(() => undefined);
}

export function installSiteAudioUnlock() {
  if (typeof window === 'undefined') return () => undefined;

  const unlock = () => {
    requestedStart = true;
    void ensureWidget().then((instance) => {
      instance?.setVolume(mutedState ? 0 : VOLUME);
      instance?.play();
    }).catch(() => undefined);
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
