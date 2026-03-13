import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CancelPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-yellow-400">
          Checkout canceled
        </p>
        <h1 className="section-title">You didn&apos;t finish checkout</h1>
        <p className="section-subtitle">
          No worries — your cart is still here if you decide to complete the
          purchase later.
        </p>
      </header>

      <section className="card-surface p-5 space-y-3 text-sm text-gray-200">
        <p>
          If something went wrong with payment, you can try again or contact
          Unleashed Gems for direct support with your order.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/checkout">
            <Button size="sm">Try checkout again</Button>
          </Link>
          <Link href="/beats">
            <Button variant="secondary" size="sm">
              Back to beats
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

