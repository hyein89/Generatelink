import { useState } from 'react';
import Head from 'next/head';


export default function Home() {
  const [offerUrl, setOfferUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [encodedLink, setEncodedLink] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [notify, setNotify] = useState('');

  const showNotify = (msg: string) => {
    setNotify(msg);
    setTimeout(() => setNotify(''), 2500);
  };

  const handleUpload = async () => {
    if (!offerUrl || !apiKey || !file) {
      showNotify('⚠️ Lengkapi semua field!');
      return;
    }

    showNotify('⏳ Uploading image...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        showNotify('❌ Gagal upload! Periksa API key kamu.');
        return;
      }

      const imageUrl = data.data.url;
      const resizedImg = `https://wsrv.nl/?url=${encodeURIComponent(
        imageUrl
      )}&w=720&h=512&fit=crop`;
      // gunakan || sebagai delimiter
const combined = offerUrl + '||' + resizedImg;
const encoded = btoa(unescape(encodeURIComponent(combined)))
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');
const fullLink = `${window.location.origin}/${encoded}`;

      setEncodedLink(fullLink);
      setImagePreview(resizedImg);
      showNotify('✅ Sukses Generate!');
    } catch {
      showNotify('❌ Gagal upload!');
    }
  };

  const copyToClipboard = async () => {
    if (!encodedLink) return;
    try {
      await navigator.clipboard.writeText(encodedLink);
      showNotify('✅ Copied to clipboard!');
    } catch {
      showNotify('❌ Gagal menyalin!');
    }
  };

  return (
    <>
      <Head>
        <title>Offer Generator + Redirect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container">
        <header>
          <span className="material-icons-round">link</span>
          Offer Generator + Redirect
        </header>

        <main>
          <div>
            <label>Offer URL</label>
            <input
              type="url"
              placeholder="https://example.com/offer"
              value={offerUrl}
              onChange={(e) => setOfferUrl(e.target.value)}
            />
          </div>

          <div>
            <label>ImgBB API Key</label>
            <input
              type="text"
              placeholder="Masukkan API key Imgbb kamu"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div>
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <button onClick={handleUpload}>
            <span className="material-icons-round">cloud_upload</span> Upload & Generate
          </button>

          {encodedLink && (
            <>
              <div className="output">{encodedLink}</div>
              <button className="copy-btn" onClick={copyToClipboard}>
                <span className="material-icons-round">content_copy</span> Copy
              </button>
              <div className="image-preview">
                <img src={imagePreview} alt="Preview Image" />
              </div>
            </>
          )}

          {notify && <div className="notify">{notify}</div>}
        </main>
      </div>
    </>
  );
}
