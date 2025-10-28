// pages/[slug].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { pageTitle } from '../lib/config';

export default function SlugPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [offerUrl, setOfferUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
  if (!slug || typeof slug !== 'string') return;

  try {
    // Decode URL-safe Base64
    const base64 = slug.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);

    // Split offer dan image (delimiter: '||')
    const [offer] = decoded.split('||'); // kita ambil hanya offer dari encode

    setOfferUrl(offer);

    // Ambil image dari JSON di folder public
    fetch('/images.json')
      .then(res => res.json())
      .then(data => {
        if (data?.image) setImageUrl(data.image);
      })
      .catch(() => setImageUrl('')); // fallback

    // Redirect otomatis setelah 1.2 detik
    const timer = setTimeout(() => {
      router.replace(offer);
    }, 1200);

    return () => clearTimeout(timer);
  } catch {
    router.replace('/404');
  }
}, [slug, router]);


  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/loading.css" />
      </Head>

      <div className="lol">
        {/* Gambar utama langsung */}
        <img src={imageUrl || ''} alt="Redirecting..." />

        {/* Gambar kecil 1px seperti template lama */}
        <img
          src="https://i.sstatic.net/Gd519.gif"
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

      {/* Lazy load JS untuk gambar 1px */}
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
                      img.src = img.dataset.src || img.src;
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
