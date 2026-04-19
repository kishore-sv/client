"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LandingPage() {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // Avoid hydration mismatch
	}

	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground">
			{/* Navbar */}
			<header className="h-16 flex items-center justify-between px-6 border-b">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<div className="h-7 w-7 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm font-black shadow-sm">
						C
					</div>
					<span className="tracking-tight">Client</span>
				</Link>

				<div className="flex items-center gap-4">
					<Link
						href="/login"
						className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						Login
					</Link>
					<Button size="sm" asChild className="rounded-lg shadow-sm">
						<Link href="/client">Open App</Link>
					</Button>
				</div>
			</header>

			{/* Hero */}
			<main className="flex-1">
				<section className="py-24 px-6">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
							API testing <br className="hidden md:block" /> instantly.
						</h1>

						<p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
							A fast, minimal API client in your browser. <br className="hidden md:block" /> Zero setup. No friction. Pure performance.
						</p>

						<div className="flex justify-center gap-4 flex-wrap">
							<Button size="lg" asChild className="h-12 px-8 rounded-xl font-bold">
								<Link href="/client">Start Testing</Link>
							</Button>

							<Button variant="outline" size="lg" asChild className="h-12 px-8 rounded-xl font-bold">
								<Link href="/login">Sync Collections</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Product Preview */}
				<section className="px-6 pb-32">
					<div className="max-w-5xl mx-auto relative group">
						<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
						<div className="relative border rounded-2xl overflow-hidden bg-card shadow-2xl">
							<div className="h-8 border-b bg-muted/50 flex items-center px-4 gap-2">
								<div className="flex gap-1.5">
									<div className="h-2.5 w-2.5 rounded-full bg-border" />
									<div className="h-2.5 w-2.5 rounded-full bg-border" />
									<div className="h-2.5 w-2.5 rounded-full bg-border" />
								</div>
							</div>
							<img
								src={theme === "dark" ? "/preview-dark.png" : "/preview-light.png"}
								alt="API Client Preview"
								className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
							/>
						</div>
					</div>
				</section>

				{/* Features */}
				<section className="py-24 border-t bg-muted/20">
					<div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-16 px-6">
						<div>
							<h3 className="font-bold text-lg mb-3">No CORS hurdles</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Requests are executed through our server-side proxy, allowing you to bypass browser restrictions and test any endpoint.
							</p>
						</div>

						<div>
							<h3 className="font-bold text-lg mb-3">Zero Account Required</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Start instantly in Guest Mode. Your collections are saved locally until you're ready to sync with the cloud.
							</p>
						</div>

						<div>
							<h3 className="font-bold text-lg mb-3">macOS Explorer Style</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Organize your requests with a intuitive drag-and-drop file system. Group by projects and collections with ease.
							</p>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="py-12 px-6 border-t text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto w-full">
				<div className="flex items-center gap-2 font-bold text-foreground opacity-80">
					<div className="h-5 w-5 rounded bg-foreground text-background flex items-center justify-center text-[10px]">
						C
					</div>
					<span>Client</span>
				</div>

				<p className="order-last md:order-none opacity-60">© 2026 Client. All rights reserved.</p>

				<div className="flex gap-6 font-medium">
					<Link target="_blank" href="https://github.com/kishore-sv" className="hover:text-foreground transition-colors">
						GitHub
					</Link>
					<Link target="_blank" href="https://x.com/kishore_sv_7" className="hover:text-foreground transition-colors">
						Twitter
					</Link>
				</div>
			</footer>
		</div>
	);
}