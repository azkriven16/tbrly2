import { Book } from "lucide-react";
import Link from "next/link";

export function FooterSection() {
  const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="py-12 px-4 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="font-bitcount text-xl font-bold text-primary">
              TBRLY
            </span>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 TBRLY. All rights reserved. Built for{" "}
            <span className="font-dancing-script text-primary">
              book lovers
            </span>
            , by{" "}
            <span className="font-dancing-script text-primary">
              book lovers
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
