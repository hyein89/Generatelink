import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/custom.css";

interface Props {
  offerUrl?: string;
  imageUrl?: string;
}

export default function Home({ offerUrl, imageUrl }: Props) {
  const [offer, setOffer] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [encodedResult, setEncodedResult] = useState("");
  const [notify, setNotify] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // === Redirect Mode ===
  useEffect(() => {
    if (offerUrl && imageUrl) {
      const timer = setTimeout(() => {
        window.location.href = offerUrl;
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [offerUrl, imageUrl]);

  if (offerUrl && imageUrl) {
    return (
      <>
        <Head>
          <title>Offer Preview</title>
          <meta property="og:title" content="Exclusive Offer" />
          <meta property="og:description" content="Click to claim your offer!" />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:url" content={offerUrl} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#000",
          }}
        >
          <img
            src={imageUrl}
            alt="Offer"
            style={{ width: "100%", height: "auto", maxWidth: "800px" }}
          />
        </div>
      </>
    );
  }

  // === Normal Mode (Generator) ===
  async function handleUpload() {
    if (!offer || !apiKey || !file) {
      showNotify("⚠️ Lengkapi semua field!");
      return;
    }

    showNotify("⏳ Uploading image...");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        showNotify("❌ Gagal upload! Periksa API key kamu.");
        return;
      }

      const imageUrl = data.data.url;
      const resizedImg = `https://wsrv.nl/?url=${encodeURIComponent(
        imageUrl
      )}&w=720&h=512&fit=crop`;
      const combined = offer + "+" + resizedImg;
      const encoded = btoa(unescape(encodeURIComponent(combined)));

      // Ubah ke versi path /encodedbase64
      const fullLink = `${window.location.origin}/${encoded}`;
      setEncodedResult(fullLink);
      setImagePreview(resizedImg);
      showNotify("✅ Sukses Generate!");
    } catch {
      showNotify("❌ Gagal upload!");
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(encodedResult);
      showNotify("✅ Copied to clipboard!");
    } catch {
      showNotify("❌ Gagal menyalin!");
    }
  }

  function showNotify(msg: string) {
    setNotify(msg);
    setTimeout(() => setNotify(""), 2500);
  }

  return (
    <div className="container">
      <Head>
        <title>Offer Generator + Redirect</title>
        <meta name="description" content="Generate encoded offer links with preview image and redirect." />
      </Head>

      <header>
        <span className="material-icons-round">link</span>
        Offer Generator + Redirect
      </header>

      <main>
        <div>
          <label>Offer URL</label>
          <input
            type="url"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="https://example.com/offer"
          />
        </div>

        <div>
          <label>ImgBB API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Masukkan API key Imgbb kamu"
          />
        </div>

        <div>
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button onClick={handleUpload}>
          <span className="material-icons-round">cloud_upload</span> Upload & Generate
        </button>

        {encodedResult && (
          <>
            <div className="output">{encodedResult}</div>
            <button className="copy-btn" onClick={copyToClipboard}>
              <span className="material-icons-round">content_copy</span> Copy
            </button>
          </>
        )}

        {notify && <div className="notify">{notify}</div>}

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
      </main>
    </div>
  );
}

// === SSR decoding handler ===
export async function getServerSideProps({ query, params }: any) {
  let q = query.q || params?.encoded || null;

  // Support path style /encodedbase64
  if (!q && typeof params?.encoded === "string") q = params.encoded;

  if (q) {
    try {
      const decoded = decodeURIComponent(escape(Buffer.from(q, "base64").toString("utf-8")));
      const [offerUrl, imageUrl] = decoded.split("+");
      return { props: { offerUrl, imageUrl } };
    } catch {
      return { props: {} };
    }
  }

  return { props: {} };
}
