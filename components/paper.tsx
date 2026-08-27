import type { ReactNode } from 'react';

export function Paper({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-dvh overflow-hidden" style={{ background: 'var(--paper)' }}>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-35 mix-blend-multiply">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.3  0 0 0 0 0.4  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div
        aria-hidden="true"
        className="stars pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 [[data-theme=night]_&]:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 18%, #fff 60%, transparent 61%), radial-gradient(1.2px 1.2px at 28% 62%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 41% 30%, #fff 60%, transparent 61%), radial-gradient(1.4px 1.4px at 57% 12%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 66% 74%, #fff 60%, transparent 61%), radial-gradient(1.2px 1.2px at 78% 40%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 88% 22%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 92% 66%, #fff 60%, transparent 61%), radial-gradient(1.4px 1.4px at 8% 82%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 48% 88%, #fff 60%, transparent 61%)',
        }}
      />
      <div className="relative">{children}</div>
    </main>
  );
}
