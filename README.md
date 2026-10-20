# WICKED GRIN — Combat Arms Clan V3

Reconstrução completa do site do clã **WICKED GRIN**, derivada do novo banner verde fornecido pelo clã. A identidade visual combina prisão tática, lua verde, neon tóxico, HUD militar e glassmorphism.

> **Aviso:** Combat Arms é marca registrada de seus respectivos proprietários. Este site é uma fan page não oficial do clã Wicked Grin.

## Stack atual

- React 19 + TypeScript + Vite/TanStack Start
- TanStack Router
- Tailwind CSS já existente no projeto
- Lucide React
- Animações nativas CSS + IntersectionObserver, evitando novas dependências pesadas e mantendo `bun.lock` estável
- Integração Supabase por REST, sem SDK adicional

## Rotas

- `/` — Início: hero, vídeo, pilares, números, elenco, notícias, recrutamento
- `/sobre` — história, valores, regras e liderança
- `/elenco` — roster com busca, filtro e modal
- `/patentes` — patentes do jogo + hierarquia interna
- `/midia` — screenshots, vídeos, highlights e torneios
- `/comunidade` — Discord, redes, calendário e hall da fama
- `/contato` — alistamento
- `/admin` — painel protegido por Supabase Auth

## Banner

O novo banner fornecido pelo clã foi exportado sem alterar sua composição para:

- `public/assets/wicked-grin-hero.webp`

O hero aplica apenas efeitos de interface: vinheta, glow, god rays, névoa, partículas e iluminação. A arte original não é reconstruída em código.

## Patentes oficiais

A página está pronta para os arquivos reais em:

```text
/public/assets/patentes/patente-01.png
/public/assets/patentes/patente-02.png
...
```

Os dados ficam em `src/data/wicked-v3.ts`. Como a lista oficial ainda não foi enviada, nomes e níveis permanecem marcados como **A DEFINIR** em vez de serem inventados.

## Supabase / backend

O schema está em:

```text
supabase/schema.sql
```

Execute o arquivo no SQL Editor do Supabase e configure no ambiente de deploy:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

O formulário `/contato` envia para `recruitment_requests` quando essas variáveis existem. Sem elas, funciona conscientemente em modo demonstração.

O `/admin` usa Supabase Auth por e-mail/senha e oferece CRUD genérico para membros, patentes, notícias, mídia, eventos, números e pedidos de recrutamento. Crie manualmente os usuários autorizados no Supabase Auth. Antes de produção, refine a policy de `authenticated` do schema para uma role/claim administrativa específica.

## Conteúdo a providenciar

- Imagens oficiais das patentes e a lista correta de nomes/níveis
- Avatares e dados reais dos membros
- Link do vídeo/trailer do clã
- Discord + ID do servidor
- YouTube, Instagram, TikTok e WhatsApp
- Datas reais de eventos, conquistas e números do clã
- Projeto Supabase e credenciais públicas de ambiente

## Desenvolvimento

```bash
bun install --frozen-lockfile
bun run test
bun run build
```

## Performance e acessibilidade

A interface reduz blur e complexidade visual no mobile, possui fallback sem `backdrop-filter` e respeita `prefers-reduced-motion`. O cursor customizado aparece apenas em dispositivos com ponteiro fino.

## Lovable

A Lovable pode permanecer apenas como visualização/hospedagem. As alterações deste projeto são feitas diretamente no GitHub.
