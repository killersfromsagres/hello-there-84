const TRACK_URL = 'https://soundcloud.com/caspaofficial/caspa-rusko-custard-chucker';
const STORAGE_KEY = 'wg-audio-muted';
const PLAYER_ID = 'wg-background-audio';
const SDK_ID = 'wg-soundcloud-sdk';
const VOLUME = 35;
const MIN_VALID_FINISH_MS = 180_000;
const SDK_TIMEOUT_MS = 8_000;

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
let widgetPromise: Promise<SoundCloudWidget | null> | null = null;
let lastPositionMs = 0;
let restarting = false;

function readStoredMuted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // localStorage can throw in privacy/sandboxed contexts. Audio preferences should
    // never be able to crash the whole React tree.
    return false;
  }
}

function persistStoredMuted(muted: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch {
    // Storage is optional. Keep the in-memory preference for this session.
  }
}

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

  // If a previous script tag stalled or failed, replace it instead of waiting on a
  // load event that will never fire.
  document.getElementById(SDK_ID)?.remove();

  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SDK_ID;
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;

    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      callback();
    };
    const timeout = window.setTimeout(
      () => finish(() => reject(new Error('SoundCloud SDK timed out'))),
      SDK_TIMEOUT_MS,
    );

    script.addEventListener('load', () => finish(resolve), { once: true });
    script.addEventListener('error', () => finish(() => reject(new Error('SoundCloud SDK unavailable'))), { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    document.getElementById(SDK_ID)?.remove();
    throw error;
  });

  return sdkPromise;
}

function ensureWidget() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (widget) return Promise.resolve(widget);
  if (widgetPromise) return widgetPromise;

  widgetPromise = (async () => {
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
  })().catch((error) => {
    widgetPromise = null;
    throw error;
  });

  return widgetPromise;
}

export function getStoredMuted() {
  if (typeof window === 'undefined') return false;
  return readStoredMuted();
}

export function setSiteAudioMuted(muted: boolean) {
  if (typeof window === 'undefined') return;
  mutedState = muted;
  persistStoredMuted(muted);

  // Do not create a SoundCloud iframe/network request just because the preference
  // changed. If the player is already active, update it immediately.
  if (widget) {
    widget.setVolume(muted ? 0 : VOLUME);
    if (ready && requestedStart) widget.play();
  }
}

export function startSiteAudio() {
  if (typeof window === 'undefined') return;
  mutedState = readStoredMuted();
  requestedStart = true;
  // Intentionally defer third-party SoundCloud loading until the first real user
  // interaction. This keeps initial rendering independent from network/audio SDKs.
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
  };

  window.addEventListener('pointerdown', unlock, { passive: true, once: true });
  window.addEventListener('keydown', unlock, { once: true });

  return () => {
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
}
