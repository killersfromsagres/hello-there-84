# WICKED GRIN — Combat Arms Clan

Site oficial do clã **WICKED GRIN**, com identidade de base tática noturna em português do Brasil. O projeto usa React, TypeScript, TanStack Start, Vite e Tailwind CSS.

> Combat Arms e marcas relacionadas pertencem aos seus respectivos proprietários. Este é um site independente de fãs e não possui afiliação ou endosso oficial.

## Estrutura atual

O site foi reduzido para seis áreas: **Início, Sobre, Membros, Regras, Recrutamento e Comunidade**. Ranking, operações e galeria foram removidos da home para reduzir ruído visual e deixar a navegação mais objetiva.

## Desenvolvimento

```bash
bun install
bun run test
bun run build
```

## Banner

O banner limpo aprovado pelo clã é carregado por `src/assets/wicked-banner.ts` e pelos fragmentos em `src/assets/banner/`. Ele é mantido como arte de fundo, sem botões ou controles embutidos. A interface, navegação e painéis ficam separados em HTML/CSS.

Não substitua o banner por ilustração gerada. No mobile o ponto focal é controlado por `object-position` em `src/banner-v2.css`.

## Membros

Todos os dados da equipe ficam em um único arquivo:

- `src/data/clan.ts`

Cada membro possui `id`, `nick`, hierarquia, função, patente, arma, status, data de entrada e observação. Para adicionar um membro, duplique um objeto da lista `members` e edite os campos. Para remover, apague o objeto correspondente.

Não existe painel administrativo nem banco de dados nesta versão. A edição é feita no arquivo e publicada pelo GitHub.

## Recrutamento

O formulário fica em `src/components/clan/recruitment.tsx`, com validação em `src/components/clan/recruitment-schema.ts`.

Ele tem três etapas: **Dados do jogador → Experiência → Motivação**. O envio está em **modo demonstração** e não salva dados.

Para ativar candidaturas reais, conecte Supabase, um endpoint próprio ou um serviço de formulários e substitua o estado de sucesso local pelo envio seguro. Nunca exponha chaves privadas no front-end.

## Discord e redes

Edite `clanConfig` em `src/data/clan.ts`:

```ts
export const clanConfig = {
  discordInvite: 'https://discord.gg/...',
  discordServerId: '...',
  instagram: 'https://instagram.com/...',
  youtube: 'https://youtube.com/@...',
  twitch: 'https://twitch.tv/...',
};
```

## Identidade visual

Os tokens de cor, vidro, blur, botões chanfrados, campos, filtros, modal de membro e responsividade ficam centralizados em `src/banner-v2.css`. Os ícones táticos reutilizáveis e o sorriso ficam em `src/components/clan/marks.tsx`.

A interface respeita `prefers-reduced-motion` e `prefers-reduced-transparency`, e inclui fallback para navegadores sem `backdrop-filter`.

## Lovable

A Lovable fica somente para **visualização e hospedagem**. O desenvolvimento pode ser feito diretamente no GitHub; mudanças incorporadas à `main` sincronizam com o projeto conectado.

## Pendências antes do lançamento definitivo

- Configurar convite/ID do Discord e redes sociais.
- Conectar o backend do recrutamento.
- Substituir dados fictícios dos membros pelos dados reais do clã.
- Ajustar os números demonstrativos do hero para os números reais.
- Definir domínio e imagem Open Graph definitiva.
