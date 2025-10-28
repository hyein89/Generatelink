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
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    try {
      // URL-safe Base64 decode
      const base64 = slug.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      const [offer, img] = decoded.split('||');

      if (!offer || !img) throw new Error('Invalid');

      setOfferUrl(offer);
      setImageUrl(img);

      // Delay 1.2 detik sebelum redirect
      const timer = setTimeout(() => {
        router.replace(offer);
      }, 11200);

      return () => clearTimeout(timer);
    } catch {
      router.replace('/404'); // redirect jika invalid
    }
  }, [slug, router]);

  // Lazy load
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



      <img src={imageUrl ? imageUrl : '/placeholder.png'}/>
      <img src="https://i.sstatic.net/Gd519.gif" style={{ position: 'absolute', width: '1px', height: '1px' }} className="lazy" loading="lazy" />
      
      


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
              function lazyload() {
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
