import type { SVGProps } from 'react';
export function Grin({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 100 66" fill="none" className={className} aria-hidden="true" {...props}><path d="M8 14 34 23 28 9M92 14 66 23 72 9" stroke="currentColor" strokeWidth="5"/><path d="M5 28Q50 77 95 28L83 49 77 37 67 58 60 44 50 64 40 44 33 58 23 37 17 49Z" fill="currentColor"/></svg>;
}
export function TacticalIcon({ kind = 'target', className = '' }: { kind?: 'target' | 'shield' | 'arrow' | 'cross' | 'signal'; className?: string }) {
 const paths = { target: <><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/></>, shield: <><path d="m12 2 8 4v7l-8 9-8-9V6Z"/><path d="m8 12 3 3 5-6"/></>, arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>, cross: <path d="M5 5l14 14M19 5 5 19"/>, signal: <><path d="M4 18v3m5-8v8m6-13v13m5-18v18"/></> };
 return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paths[kind]}</svg>;
}
