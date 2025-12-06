import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Image generation
export default async function Icon() {
  // Fetch the favicon image from figma:asset
  const faviconUrl = await import('figma:asset/d97c92fa41b8032e5df3837e2ba68cd6e8d66722.png');
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a0d47',
        }}
      >
        <img src={faviconUrl.default} alt="favicon" width={32} height={32} />
      </div>
    ),
    {
      ...size,
    }
  );
}
