"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";

const links = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/#story", label: "Story" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container-page flex items-center justify-between gap-4 py-3.5">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-1.5 lg:flex">
          {links.map((link) => {
            const isActive =
              (link.href === "/" && pathname === "/") ||
              (link.href === "/tools" && pathname.startsWith("/tools"));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`nav-link px-3 py-2 text-[0.9375rem] font-medium ${
                  isActive ? "is-active" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/tools" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Open the tools
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-[0.85rem] border border-border bg-background-secondary text-foreground lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div id="mobile-nav" className="glass-nav px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-background-elevated"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary mt-2 w-full"
            >
              Open the tools
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
