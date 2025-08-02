import Link from "next/link";
// import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {
    ShoppingBag,
    User,
    Settings,
    Heart,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {AuthButton} from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import {LogoutButton} from "@/components/logout-button";
import Image from "next/image";

export async function Navbar() {
    const supabase = await createClient();
    const cartCount = 0; // Replace with real cart state
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const isAdmin = user?.user_metadata?.name === "Hassan Elyatim";


    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between mx-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image width={150} height={0} src="/base logo black.png" alt="Logo" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                            Home
                        </Link>
                        <Link href="/products"
                              className="text-foreground hover:text-primary transition-colors font-medium">
                            Products
                        </Link>
                        <Link href="/about"
                              className="text-foreground hover:text-primary transition-colors font-medium">
                            About
                        </Link>
                        <Link href="/contact"
                              className="text-foreground hover:text-primary transition-colors font-medium">
                            Contact
                        </Link>
                    </nav>

                    {/* Right-side actions */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* Cart */}
                                <Button variant="ghost" size="icon" asChild className="relative">
                                    <Link href="/cart">
                                        <ShoppingBag className="h-5 w-5"/>
                                        {cartCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                                            >
                                                {cartCount}
                                            </Badge>
                                        )}
                                    </Link>
                                </Button>

                                {/* Wishlist */}
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/wishlist">
                                        <Heart className="h-5 w-5"/>
                                    </Link>
                                </Button>

                                {/* User dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <User className="h-5 w-5"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user.user_metadata?.full_name || "User"}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem asChild>
                                            <Link href="/orders">
                                                <ShoppingBag className="mr-2 h-4 w-4"/>
                                                <span>Orders</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {isAdmin && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin">
                                                    <Settings className="mr-2 h-4 w-4"/>
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem asChild>
                                            <LogoutButton />
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <AuthButton/>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}