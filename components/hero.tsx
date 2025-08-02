import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import { createClient } from "@/lib/supabase/server";

export async function Hero() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <section className="relative py-5 overflow-hidden">
            <div className="container px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center rounded-full border px-6 py-2 text-sm font-medium mb-8 bg-background/80 backdrop-blur">
                        <span className="text-primary">●</span>
                        <span className="ml-2">New Collection Available</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        Premium{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          Eyewear
                        </span>{' '}
                        Collection
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        Discover our curated selection of stylish frames and sunglasses.
                        Where quality craftsmanship meets modern design.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        {user ? (
                            <>
                                <Link href="/products">
                                    <Button size="lg" className="px-8 py-3 text-lg group">
                                        Browse Collection
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                    <Play className="mr-2 h-5 w-5" />
                                    Watch Story
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button size="lg" className="px-8 py-3 text-lg group">
                                        Sign In to Shop
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                    <Play className="mr-2 h-5 w-5" />
                                    Learn More
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                        {[
                            { value: '10K+', label: 'Happy Customers' },
                            { value: '500+', label: 'Unique Frames' },
                            { value: '50+', label: 'Brands' },
                            { value: '24/7', label: 'Support' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}