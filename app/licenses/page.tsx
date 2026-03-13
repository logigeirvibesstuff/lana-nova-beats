import { licenseTiers } from "@/data/licenses";

export default function LicensesPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-700">
          Licenses
        </p>
        <h1 className="section-title">License options</h1>
        <p className="section-subtitle">
          Clear, artist-friendly terms for using Unleashed Gems beats in your music
          and content.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {licenseTiers.map((tier) => (
          <article key={tier.id} className="card-surface p-5 space-y-3">
            <h2 className="text-lg font-semibold text-black">{tier.name}</h2>
            <p className="text-xs text-gray-800">{tier.description}</p>
            <p className="text-xs text-gray-200">{tier.usageSummary}</p>
          </article>
        ))}
      </div>

      <section className="card-surface p-5 space-y-2 text-xs text-gray-800">
        <h2 className="text-sm font-semibold text-black">
          General terms (summary)
        </h2>
        <ul className="list-disc space-y-1 pl-4">
          <li>
            All licenses are non-refundable and non-transferable once delivered.
          </li>
          <li>
            You may not resell or redistribute the instrumental alone as a beat
            or sample pack.
          </li>
          <li>
            Unleashed Gems retains authorship and publishing splits may apply for
            major releases.
          </li>
        </ul>
        <p className="text-[0.7rem] text-gray-700">
          This is a simplified overview. For major label or high-budget
          projects, contact Unleashed Gems directly to agree on tailored terms.
        </p>
      </section>
    </div>
  );
}

