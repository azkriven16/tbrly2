import { Button } from "@/components/ui/button";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/hero-img.jpg"
            alt="Hero Image"
            width={500}
            height={300}
            className="rounded-full"
          />
        </div>

        <h1 className="font-funnel text-4xl md:text-6xl font-bold mb-6">
          Track Your{" "}
          <span className="font-black underline">Reading Journey</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Organize your to-be-read list, track your progress, rate your
          favorites, and discover your next great read with{" "}
          <span className="font-funnel text-primary font-black">TBRLY</span>.
        </p>

        <div className="flex gap-4 justify-center">
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
      </div>
    </section>
  );
};
