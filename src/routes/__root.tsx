import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps } from '@tanstack/react-router';
import { useEffect, type ReactNode } from 'react';
import appCss from '../styles.css?url';
import wickedCss from '../wicked-v3.css?url';
import adminCss from '../wicked-admin.css?url';
import memberRanksCss from '../member-ranks.css?url';
import heroAudioCss from '../hero-audio-fix.css?url';
import operatorSpotlightCss from '../operator-spotlight.css?url';
import stabilityCss from '../performance-stability.css?url';
import cursorFixCss from '../cursor-fix.css?url';
import heroFinalCss from '../hero-final.css?url';
import { reportLovableError } from '../lib/lovable-error-reporting';
import { HERO_URL } from '../assets/hero-url';

function NotFoundComponent() {
  return <div className="wg3-site"><div className="wg3-page-hero" style={{ minHeight: '100vh', alignItems: 'center' }}><div className="wg3-shell"><span className="wg3-kicker">ERRO // 404</span><h1 style={{ fontFamily: 'Black Ops One', fontSize: 'clamp(4rem,10vw,9rem)', margin: '14px 0' }}>ÁREA <em style={{ color: '#39ff14', fontStyle: 'normal' }}>RESTRITA</em></h1><p>Essa coordenada não faz parte da operação.</p><Link to="/" className="neon-btn" style={{ marginTop: 24 }}>VOLTAR PARA A BASE</Link></div></div></div>;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: 'tanstack_root_error_component' }); }, [error]);
  return <div className="wg3-site"><div className="wg3-page-hero" style={{ minHeight: '100vh', alignItems: 'center' }}><div className="wg3-shell"><span className="wg3-kicker">FALHA DE SISTEMA</span><h1 style={{ fontFamily: 'Black Ops One', fontSize: 'clamp(3rem,8vw,7rem)', margin: '14px 0' }}>MISSÃO <em style={{ color: '#ff3b3b', fontStyle: 'normal' }}>FALHOU</em></h1><p>Tente reiniciar a interface ou volte para a base.</p><div style={{ display: 'flex', gap: 10, marginTop: 24 }}><button className="neon-btn" onClick={() => { router.invalidate(); reset(); }}>TENTAR NOVAMENTE</button><a className="ghost-btn" href="/">INÍCIO</a></div></div></div></div>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#050806' },
      { name: 'color-scheme', content: 'dark' },
      { property: 'og:site_name', content: 'WICKED GRIN' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: wickedCss },
      { rel: 'stylesheet', href: adminCss },
      { rel: 'stylesheet', href: memberRanksCss },
      { rel: 'stylesheet', href: heroAudioCss },
      { rel: 'stylesheet', href: operatorSpotlightCss },
      { rel: 'stylesheet', href: stabilityCss },
      { rel: 'stylesheet', href: cursorFixCss },
      { rel: 'stylesheet', href: heroFinalCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preload', href: HERO_URL, as: 'image', type: 'image/avif' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Black+Ops+One&family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@500;600;700&display=swap' },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="pt-BR" className="dark"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;
}
