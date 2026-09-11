// 하늘 배경(종이색 + 지질감 + 별) — 낱장 넘김에서 고정되는 레이어.
// 반드시 .vt-page 바깥(layout)에 두어야 잎과 함께 벗겨지지 않는다.
// data-sky: page-turn.tsx가 넘김 낱장 복제 시 이 레이어를 찾아 함께 복제한다 (앞장이 투명해지지 않도록).
export function Sky() {
  return (
    <div aria-hidden="true" data-sky className="pointer-events-none fixed inset-0" style={{ background: 'var(--paper)' }}>
      <svg className="absolute inset-0 h-full w-full opacity-35 mix-blend-multiply">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.3  0 0 0 0 0.4  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div
        className="stars absolute inset-0 opacity-0 transition-opacity duration-700 [[data-theme=night]_&]:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 18%, #fff 60%, transparent 61%), radial-gradient(1.2px 1.2px at 28% 62%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 41% 30%, #fff 60%, transparent 61%), radial-gradient(1.4px 1.4px at 57% 12%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 66% 74%, #fff 60%, transparent 61%), radial-gradient(1.2px 1.2px at 78% 40%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 88% 22%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 92% 66%, #fff 60%, transparent 61%), radial-gradient(1.4px 1.4px at 8% 82%, #fff 60%, transparent 61%), radial-gradient(1px 1px at 48% 88%, #fff 60%, transparent 61%)',
        }}
      />
    </div>
  );
}
