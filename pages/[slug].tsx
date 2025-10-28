import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function RedirectPage() {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const [imageUrl, setImageUrl] = useState('');
  const [offerUrl, setOfferUrl] = useState('');

  useEffect(() => {
    if (!slug) return;
    try {
      const decoded = decodeURIComponent(escape(atob(slug)));
      const [url, img] = decoded.split('+');
      if (!url || !img) throw new Error('Invalid');

      setOfferUrl(url);
      setImageUrl(img);

      setTimeout(() => {
        window.location.href = url;
      }, 1200);
    } catch {
      router.replace('/404');
    }
  }, [slug, router]);

  if (!imageUrl) return null;

  return (
    <>
      <Head>
        <title>Redirecting...</title>
        <meta property="og:title" content="Special Offer" />
        <meta property="og:description" content="Click to see this amazing offer!" />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#000' }}>
        <img src={imageUrl} alt="Redirect Preview" style={{ width: '100%', maxWidth: 800, height: 'auto' }} />
      </div>
    </>
  );
}
