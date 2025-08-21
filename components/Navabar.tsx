import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
    ShoppingBag,
    User,
    Settings,
    Heart,
    LayoutDashboard,
    Menu,
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
import {createClient} from "@/lib/supabase/server";
import {LogoutButton} from "@/components/logout-button";
import Image from "next/image";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import CartButton from "@/components/CartIcon";


export async function Navbar() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();
    const isAdmin = user?.user_metadata?.name === "Hassan Elyatim";

    const navLinks = [
        {
            label: "Products",
            submenu: ["Female", "Male", "Child", "Unisex"],
        },
        {
            label: "Sunglasses",
            submenu: ["Female", "Male", "Child", "Unisex"],
        },
    ];

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            width={120}
                            height={40}
                            src="/base logo black.png"
                            alt="Logo"
                            className="h-auto w-auto"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex">
                        <NavigationMenu>
                            <NavigationMenuList className="flex items-center">
                                {navLinks.map((link) =>
                                    link.submenu ? (
                                        <NavigationMenuItem key={link.label}>
                                            <NavigationMenuTrigger
                                                className="text-gray-700 hover:text-black font-semibold text-lg transition">
                                                {link.label}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="bg-white rounded-md shadow-lg p-4">
                                                <ul className="grid w-[300px] gap-2 md:w-[500px] md:grid-cols-4 lg:w-[300px]">
                                                    {link.submenu.map((label) => (
                                                        <Link
                                                            key={label}
                                                            href={`/products?gender=${label}`}
                                                            className="block text-center text-sm font-semibold text-gray-600 hover:text-black transition"
                                                        >
                                                            {label}
                                                        </Link>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    ) : (
                                        <NavigationMenuItem key={link.label}>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={link.href!}
                                                    className="text-gray-700 hover:text-black font-medium transition"
                                                >
                                                    {link.label}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    )
                                )}

                                {isAdmin && (
                                    <NavigationMenuItem>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-black font-semibold transition-colors bg-amber-100 hover:bg-amber-200"
                                        >
                                            <LayoutDashboard size={18}/>
                                            Dashboard
                                        </Link>
                                    </NavigationMenuItem>
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Desktop Right-side */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* Cart */}
                                <Button variant="ghost" size="icon" asChild className="relative">
                                    <Link href="/cart">
                                        <CartButton />
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
                                        <Button
                                            variant="ghost"
                                            className="relative h-8 w-8 rounded-full"
                                        >
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
                                            <LogoutButton/>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <AuthButton/>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-4">
                                <div className="flex flex-col space-y-4">
                                    {navLinks.map((link) =>
                                        link.submenu ? (
                                            <div key={link.label}>
                                                <p className="font-semibold">{link.label}</p>
                                                <ul className="ml-4 space-y-2">
                                                    {link.submenu.map((label) => (
                                                        <li key={label}>
                                                            <Link
                                                                href={`/products?gender=${label}`}
                                                                className="text-sm text-gray-600 hover:text-black"
                                                            >
                                                                {label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <Link
                                                key={link.label}
                                                href={link.href!}
                                                className="text-gray-700 hover:text-black font-medium"
                                            >
                                                {link.label}
                                            </Link>
                                        )
                                    )}

                                    {isAdmin && (
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-black font-semibold transition-colors bg-amber-100 hover:bg-amber-200"
                                        >
                                            <LayoutDashboard size={18}/>
                                            Dashboard
                                        </Link>
                                    )}

                                    <div className="pt-4 border-t">
                                        {user ? (
                                            <>
                                                <Link href="/cart" className="flex items-center gap-2">

                                                </Link>
                                                <Link
                                                    href="/wishlist"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Heart className="h-5 w-5"/> Wishlist
                                                </Link>
                                                <Link href="/orders" className="flex items-center gap-2">
                                                    <ShoppingBag className="h-5 w-5"/> Orders
                                                </Link>
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Settings className="h-5 w-5"/> Admin Dashboard
                                                    </Link>
                                                )}
                                                <LogoutButton/>
                                            </>
                                        ) : (
                                            <AuthButton/>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
