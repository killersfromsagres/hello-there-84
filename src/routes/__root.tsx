import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-primary">ERRO DE ROTA // 404</p>
        <h1 className="mt-3 font-display text-7xl font-bold text-foreground">ALVO NÃO ENCONTRADO</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Essa coordenada não existe mais ou nunca fez parte da operação.
        </p>
        <div className="mt-7">
          <Link
            to="/"
            className="tactical-button inline-flex items-center justify-center bg-primary px-5 py-3 font-display text-sm font-bold uppercase text-primary-foreground"
          >
            Voltar ao quartel-general
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-destructive">FALHA DE SISTEMA</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase text-foreground">
          A operação saiu do ar
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tente recarregar a interface. Se a falha continuar, volte para o início.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="tactical-button inline-flex items-center justify-center bg-primary px-5 py-3 font-display text-sm font-bold uppercase text-primary-foreground"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-input bg-background px-5 py-3 font-display text-sm font-bold uppercase text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#07080B" },
      { name: "color-scheme", content: "dark" },
      { property: "og:site_name", content: "WICKED GRIN" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Rajdhani:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
