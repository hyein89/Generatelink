// pages/[slug].tsx
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { pageTitle } from '../lib/config';

interface Props {
  offerUrl: string;
  imageUrl: string;
}

export default function SlugPage({ offerUrl, imageUrl }: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="stylesheet" href="/loading.css" />
        {/* Meta tags sosial media */}
        
        {/* Meta tags sosial media */}
        <meta property="og:title" content="Redirecting..." />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      
     <img src={imageUrl}/>
      
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

            // Redirect otomatis setelah 1.2 detik
            setTimeout(() => { window.location.href = "${offerUrl}"; }, 1200);
          `,
        }}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  if (!slug || typeof slug !== 'string') {
    return { notFound: true };
  }

  try {
    // Decode URL-safe Base64
    const base64 = slug.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');

    // Split offer + image
    const [offerUrl, imageUrl] = decoded.split('||');
    if (!offerUrl || !imageUrl) throw new Error('Invalid');

    return { props: { offerUrl, imageUrl } };
  } catch {
    return { notFound: true };
  }
};
