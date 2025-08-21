"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t mt-20">
            <div className="container mx-auto py-12 flex flex-col items-center gap-8 text-center">
                <div>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                        Premium eyewear designed for modern sophistication.
                    </p>
                </div>

                {/* Navigation */}
                <nav
                    aria-label="Footer navigation"
                    className="text-sm"
                >
                    <ul className="space-y-2">
                        <li className="flex flex-row gap-5">
                            <div><Link href="#sunglasses" className="hover:text-primary">
                                Sunglasses
                            </Link></div>
                            <div><Link href="#eyeglasses" className="hover:text-primary">
                                Eyeglasses
                            </Link></div>
                        </li>
                        <li>
                            <Link href="#collections" className="hover:text-primary">
                                Collections
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Social Icons */}
                <div className="flex gap-6">
                    <Link
                        href="https://facebook.com"
                        target="_blank"
                        className="hover:text-primary transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook size={20} />
                    </Link>
                    <Link
                        href="https://instagram.com"
                        target="_blank"
                        className="hover:text-primary transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram size={20} />
                    </Link>
                    <Link
                        href="https://twitter.com"
                        target="_blank"
                        className="hover:text-primary transition-colors"
                        aria-label="Twitter"
                    >
                        <Twitter size={20} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}