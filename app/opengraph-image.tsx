import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background:
            'linear-gradient(135deg, rgba(62,128,43,1) 0%, rgba(36,78,25,1) 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
          Zdravie v praxi
        </div>
        <div style={{ fontSize: 30, opacity: 0.95, maxWidth: 900 }}>
          Overené informácie, tipy a rady pre zdravý životný štýl
        </div>
        <div style={{ display: 'flex', gap: 16, opacity: 0.9 }}>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.22)',
              fontSize: 22,
            }}
          >
            zdravie
          </div>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.22)',
              fontSize: 22,
            }}
          >
            výživa
          </div>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.22)',
              fontSize: 22,
            }}
          >
            životný štýl
          </div>
        </div>
      </div>
    ),
    size
  );
}
