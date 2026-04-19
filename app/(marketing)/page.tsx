"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function LandingPage() {
	const { theme } = useTheme()
	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground">

			{/* Navbar */}
			<header className="h-16 flex items-center justify-between px-6 border-b">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<div className="h-7 w-7 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm">
						C
					</div>
					Client
				</Link>

				<div className="flex items-center gap-4">
					<Link
						href="/login"
						className="text-sm text-muted-foreground hover:text-foreground transition"
					>
						Login
					</Link>
					<Button size="sm" asChild>
						<Link href="/client">Open App</Link>
					</Button>
				</div>
			</header>

			{/* Hero */}
			<main className="flex-1">
				<section className="py-24 px-6">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
							Test APIs instantly.
						</h1>

						<p className="text-muted-foreground text-lg mb-8">
							A fast, minimal API client in your browser. No setup. No friction.
						</p>

						<div className="flex justify-center gap-4 flex-wrap">
							<Button size="lg" asChild>
								<Link href="/client">Start Testing</Link>
							</Button>

							<Button variant="outline" size="lg" asChild>
								<Link href="/login">Save your work</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Product Preview */}
				<section className="px-6 pb-24">
					<div className="max-w-6xl mx-auto">
						<div className="border rounded-xl overflow-hidden bg-muted">
							<img
								src={theme === "dark" ? "preview-dark.png" : "preview-light.png"}
								alt="API Client Preview"
								className="w-full h-auto"
							/>
						</div>
					</div>
				</section>

				{/* Features */}
				<section className="py-20 border-t">
					<div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 px-6">

						<div>
							<h3 className="font-semibold mb-2">No CORS issues</h3>
							<p className="text-sm text-muted-foreground">
								Requests go through a proxy so you can test any API without errors.
							</p>
						</div>

						<div>
							<h3 className="font-semibold mb-2">No login required</h3>
							<p className="text-sm text-muted-foreground">
								Start instantly. Sign in only when you want to save your work.
							</p>
						</div>

						<div>
							<h3 className="font-semibold mb-2">Organized workflows</h3>
							<p className="text-sm text-muted-foreground">
								Group requests into projects and collections for better structure.
							</p>
						</div>

					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="py-10 px-6 border-t text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
				<span>© 2026 Client</span>

				<div className="flex gap-4">
					<Link target="_blank" href="https://github.com/kishore-sv" className="hover:text-foreground transition">
						GitHub
					</Link>
					<Link target="_blank" href="https://x.com/kishore_sv_7" className="hover:text-foreground transition">
						Twitter
					</Link>
				</div>
			</footer>
		</div>
	);
}