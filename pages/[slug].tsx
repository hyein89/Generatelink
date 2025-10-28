import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { pageTitle } from '../lib/config';


interface SlugPageProps {
  pageTitle?: string; // Bisa set dari luar
}

export default function SlugPage({ pageTitle = 'Loading...' }: SlugPageProps) {
  const router = useRouter();
  const { slug } = router.query;
  const [offerUrl, setOfferUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    try {
      // URL-safe decode: '-' -> '+', '_' -> '/'
      const base64 = slug.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = decodeURIComponent(escape(atob(base64)));
      const [offer, img] = decoded.split('+');
      setOfferUrl(offer);
      setImageUrl(img);

      // Show loader 1.2 detik sebelum redirect
      const timer = setTimeout(() => {
        router.replace(offer); // redirect
      }, 1200);

      return () => clearTimeout(timer);
    } catch {
      router.replace('/404'); // redirect ke 404 jika invalid
    }
  }, [slug]);

  // Lazy load effect
  useEffect(() => {
    const lazyloadImages = document.querySelectorAll('img.lazy');
    let lazyloadThrottleTimeout: NodeJS.Timeout;

    const lazyload = () => {
      if (lazyloadThrottleTimeout) clearTimeout(lazyloadThrottleTimeout);

      lazyloadThrottleTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        lazyloadImages.forEach((img: any) => {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
          }
        });
        if (lazyloadImages.length === 0) {
          document.removeEventListener('scroll', lazyload);
          window.removeEventListener('resize', lazyload);
          window.removeEventListener('orientationChange', lazyload);
        }
      }, 20);
    };

    document.addEventListener('scroll', lazyload);
    window.addEventListener('resize', lazyload);
    window.addEventListener('orientationChange', lazyload);

    return () => {
      document.removeEventListener('scroll', lazyload);
      window.removeEventListener('resize', lazyload);
      window.removeEventListener('orientationChange', lazyload);
    };
  }, []);

  if (!showLoader) return null;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/loading.css" />
      </Head>

      <div className="lol">
        <img
          src={imageUrl ? imageUrl : '/placeholder.png'}
          alt="Redirecting..."
          style={{ width: '100%', height: 'auto' }}
        />
        <img
          data-src={imageUrl}
          src="https://i0.wp.com/i.sstatic.net/Gd519.gif?resize=720,512"
          style={{ position: 'absolute', width: '1px', height: '1px' }}
          className="lazy"
          loading="lazy"
          alt="lazy"
        />
      </div>

      <div className="psoload">
        <div className="straight"></div>
        <div className="curve"></div>
        <div className="center"></div>
        <div className="inner"></div>
      </div>
    </>
  );
}
