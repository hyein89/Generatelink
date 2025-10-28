import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { pageTitle } from '../lib/config';

export default function SlugPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [offerUrl, setOfferUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    try {
      // Fix URL-safe Base64
      const base64 = slug
     .replace(/-/g, '+')  // - -> +
     .replace(/_/g, '/'); // _ -> /
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const decoded = decodeURIComponent(escape(atob(padded)));

      const [offer, img] = decoded.split('+');
      setOfferUrl(offer);
      setImageUrl(img);

      // Delay 1.2 detik sebelum redirect
      const timer = setTimeout(() => {
        router.replace(offer);
      }, 1200);

      return () => clearTimeout(timer);
    } catch {
      router.replace('/404'); // jika invalid
    }
  }, [slug, router]);

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

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener("DOMContentLoaded", function() {
            var lazyloadImages = document.querySelectorAll("img.lazy");
            var lazyloadThrottleTimeout;
            function lazyload () {
              if(lazyloadThrottleTimeout) clearTimeout(lazyloadThrottleTimeout);
              lazyloadThrottleTimeout = setTimeout(function() {
                var scrollTop = window.pageYOffset;
                lazyloadImages.forEach(function(img) {
                  if(img.offsetTop < (window.innerHeight + scrollTop)) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                  }
                });
                if(lazyloadImages.length == 0) {
                  document.removeEventListener("scroll", lazyload);
                  window.removeEventListener("resize", lazyload);
                  window.removeEventListener("orientationChange", lazyload);
                }
              }, 20);
            }
            document.addEventListener("scroll", lazyload);
            window.addEventListener("resize", lazyload);
            window.addEventListener("orientationChange", lazyload);
          });
        `,
        }}
      />
    </>
  );
}
