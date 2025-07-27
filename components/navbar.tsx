"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { MobileNav } from "@/components/mobile-nav";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 p-2 max-w-4xl mx-auto items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="hidden md:flex items-center gap-2">
          <span className="font-funnel text-2xl font-black text-primary hover:text-primary/80 transition-colors tracking-wide">
            TBRLY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/daily"
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            Daily Reading
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            Stats
          </Link>
          <Link
            href="/tbr"
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            TBR
          </Link>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />

        <Link href="/" className="flex md:hidden items-center gap-2">
          <span className="font-funnel text-2xl font-black text-primary hover:text-primary/80 transition-colors tracking-wide">
            TBRLY
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          <SignedOut>
            <SignInButton>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};
