import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
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
			<main className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-5xl font-black tracking-tighter mb-4">
                    Client Initialized
                </h1>
                <p className="text-muted-foreground mb-8">
                    The minimal API testing suite is ready.
                </p>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/client">Launch Editor</Link>
                    </Button>
                </div>
			</main>

			{/* Footer */}
			<footer className="py-12 px-6 border-t text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto w-full">
				<div className="flex items-center gap-2 font-bold text-foreground opacity-80">
					<div className="h-5 w-5 rounded bg-foreground text-background flex items-center justify-center text-[10px]">
						C
					</div>
					<span>Client</span>
				</div>
				<p className="opacity-60">© 2026 Client. All rights reserved.</p>
			</footer>
		</div>
	);
}