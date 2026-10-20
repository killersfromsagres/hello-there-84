import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Maximize2, Play } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { SectionTitle } from '@/components/wg/UI';
import { mediaItems } from '@/data/wicked-v3';

export const Route = createFileRoute('/midia')({ component: MediaPage, head: () => ({ meta: [{ title: 'Mídia — Wicked Grin' }, { name: 'description', content: 'Screenshots, vídeos, highlights e torneios do Wicked Grin.' }] }) });

function MediaPage() {
  const [tab, setTab] = useState('Todos');
  const tabs = ['Todos', 'Screenshot', 'Vídeo', 'Highlight', 'Torneio'];
  const items = tab === 'Todos' ? mediaItems : mediaItems.filter((item) => item.type === tab);
  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ARQUIVO // MÍDIA</span><h1>CAMPO DE <em>VISÃO</em></h1><p>Highlights, transmissões, screenshots e registros competitivos do Wicked Grin.</p></div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="01" eyebrow="GALERIA" title="REGISTROS DE OPERAÇÃO" />
      <div className="wg3-tabs">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>{item}</button>)}</div>
      <div className="wg3-media-grid">{items.map((item, index) => <article className={`wg3-media-card glass ${index % 3 === 0 ? 'wide' : ''}`} key={`${item.type}-${item.title}`}><div className="wg3-media-placeholder"><span>{item.type === 'Vídeo' ? <Play /> : <Maximize2 />}</span><i>WG // MEDIA_{String(index + 1).padStart(2, '0')}</i></div><footer><span className="wg3-kicker">{item.type}</span><h3>{item.title}</h3><p>{item.note}</p></footer></article>)}</div>
    </section>
  </main></SiteShell>;
}
