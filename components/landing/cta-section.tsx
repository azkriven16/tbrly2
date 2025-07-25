import { Button } from "@/components/ui/button";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to <span className="font-dancing-script">Transform</span> Your
          Reading Experience?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of readers who have organized their{" "}
          <span className="font-dancing-script">literary journey</span> with
          TBRLY.
        </p>

        <SignedOut>
          <SignUpButton>
            <Button
              effect="expandIcon"
              icon={ArrowRightIcon}
              iconPlacement="right"
              size="lg"
              className="font-funnel text-lg font-bold"
            >
              Get Started Free
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <Button
              effect="expandIcon"
              icon={ArrowRightIcon}
              iconPlacement="right"
              size="lg"
              className="font-funnel text-lg font-bold"
            >
              Go to Dashboard
            </Button>
          </Link>
        </SignedIn>
      </div>
    </section>
  );
}
