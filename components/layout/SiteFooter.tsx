export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-black/10 bg-black/60 backdrop-blur">
      <div className="page-container flex flex-col gap-4 py-6 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 sm:order-1">
          © {new Date().getFullYear()} Unleashed Gems. All rights reserved.
        </p>
        <div className="order-1 flex flex-wrap items-center gap-3 sm:order-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-300"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-300"
          >
            TikTok
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-300"
          >
            YouTube
          </a>
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-300"
          >
            Spotify
          </a>
        </div>
      </div>
    </footer>
  );
}

