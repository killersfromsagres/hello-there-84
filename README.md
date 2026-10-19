# WICKED GRIN — Combat Arms Clan

Site oficial do clã **WICKED GRIN**, construído como uma experiência tática/cyber em português do Brasil. O projeto usa React, TypeScript, TanStack Start, Vite e Tailwind CSS.

> Combat Arms e marcas relacionadas pertencem aos seus respectivos proprietários. Este é um site independente de fãs e não possui afiliação ou endosso oficial.

## Desenvolvimento

```bash
npm install
npm run dev
```

Para validar antes de publicar:

```bash
npm run test
npm run build
```

## Conteúdo editável

Os dados de membros, ranking, partidas e links da comunidade ficam em:

- `src/data/clan.ts`

Nesse arquivo você pode alterar nicks, funções, patentes, armas favoritas, K/D, vitórias, partidas, Discord e redes sociais sem mexer na composição visual.

## Banner e identidade

O hero atual usa o asset provisório:

- `src/assets/wicked-operator.jpg`

Para trocar pela arte final, substitua esse arquivo mantendo o mesmo nome ou altere a importação em `src/routes/index.tsx`. Para produção, prefira WebP/AVIF em alta resolução. O símbolo do sorriso e os ícones táticos reutilizáveis ficam em `src/components/clan/marks.tsx`.

## Recrutamento

O formulário em `src/components/clan/recruitment.tsx` está funcional apenas no navegador e **não persiste dados**. A validação fica em `src/components/clan/recruitment-schema.ts`.

Para ativar o envio real, conecte Supabase ou outro backend e substitua o estado demonstrativo pelo envio seguro. Nunca coloque chaves privadas no front-end.

## Discord e redes

Edite `clanConfig` em `src/data/clan.ts`:

```ts
export const clanConfig = {
  discordInvite: 'https://discord.gg/...',
  discordServerId: '...',
  instagram: 'https://instagram.com/...',
  youtube: 'https://youtube.com/@...',
};
```

O widget/CTA só deve ser ativado quando o servidor e o convite estiverem configurados.

## Lovable

Este repositório continua conectado ao projeto Lovable existente para **visualização e hospedagem**. O desenvolvimento do site pode ser feito diretamente no GitHub; mudanças publicadas em `main` sincronizam com o projeto conectado.

## Pendências antes do lançamento definitivo

- Inserir logo oficial do clã, se houver.
- Trocar o banner provisório pela arte final em alta resolução.
- Configurar Discord e redes sociais.
- Conectar backend do recrutamento.
- Substituir os membros, estatísticas e partidas fictícias pelos dados reais do clã.
- Definir domínio e imagem Open Graph definitiva.
