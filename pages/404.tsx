import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '3rem', color: '#ef4444' }}>404</h1>
        <p>Halaman tidak ditemukan.</p>
      </div>
    </>
  );
}
