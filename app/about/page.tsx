export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-700">
          About
        </p>
        <h1 className="section-title">Unleashed Gems</h1>
        <p className="section-subtitle">
          A focused catalog of dark, melodic, and cinematic beats crafted for
          artists who care about detail.
        </p>
      </header>

      <section className="card-surface p-5 space-y-3 text-sm text-gray-600">
        <p>
          Unleashed Gems is a producer obsessed with mood, space, and texture — weaving
          together trap drums, moody synths, and lush pads to create beats that
          feel like scenes from a film. This store is the central place to find
          official Unleashed Gems instrumentals and license them for your releases.
        </p>
        <p>
          Every beat is mixed with vocalists in mind, leaving room for your
          performance while still hitting hard on streaming platforms and in live
          settings.
        </p>
      </section>

      <section className="card-surface p-5 space-y-3 text-sm text-gray-600">
        <h2 className="text-base font-semibold text-black">Contact</h2>
        <p className="text-xs text-gray-600">
          For custom beats, exclusive deals, or licensing questions, reach out
          directly:
        </p>
        <ul className="space-y-1 text-xs">
          <li>
            Email:{" "}
            <a
              href="mailto:loyiibeats@gmail.com"
              className="text-lana-accent hover:underline"
            >
              loyiibeats@gmail.com
            </a>
          </li>
          <li className="text-gray-600">Response time: typically within 24–48 hours on weekdays.</li>
        </ul>
      </section>
    </div>
  );
}

