import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface Props {
  offerUrl: string;
  imageUrl: string;
}

export default function SlugPage({ offerUrl, imageUrl }: Props) {
  return (
    <>
      <Head>
        <title>Redirecting...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Meta untuk sosial media */}
        <meta property="og:title" content="Redirecting..." />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imageUrl} />
      </Head>

      <div className="lol">
        <img src={imageUrl} alt="Redirecting..." />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  if (!slug || typeof slug !== 'string') {
    return { notFound: true };
  }

  try {
    const base64 = slug.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    const [offerUrl, imageUrl] = decoded.split('||');

    if (!offerUrl || !imageUrl) throw new Error('Invalid');

    return {
      props: { offerUrl, imageUrl },
    };
  } catch {
    return { notFound: true };
  }
};
