"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBrandGithub, IconBrandGoogle, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
	const handleSocialLogin = async (provider: "google" | "github") => {
		await authClient.signIn.social({
			provider,
			callbackURL: "/client",
		});
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
			<Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
				<IconArrowLeft className="h-4 w-4" /> Back to Home
			</Link>

			<Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="bg-primary h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
							A
						</div>
					</div>
					<CardTitle className="text-3xl">Welcome Back</CardTitle>
					<CardDescription className="text-base pt-2">
						Login to Client to sync your API collections across devices.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<Button
						variant="outline"
						size="lg"
						className="h-12 text-base font-semibold border-2 hover:bg-muted"
						onClick={() => handleSocialLogin("github")}
					>
						<IconBrandGithub className="h-5 w-5 mr-3" />
						Continue with GitHub
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="h-12 text-base font-semibold border-2 hover:bg-muted"
						onClick={() => handleSocialLogin("google")}
					>
						<IconBrandGoogle className="h-5 w-5 mr-3" />
						Continue with Google
					</Button>

					<div className="mt-4 text-center">
						<p className="text-sm text-muted-foreground px-8">
							By continuing, you agree to our Terms of Service and Privacy Policy.
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="mt-8 text-center">
				<p className="text-sm text-muted-foreground">
					Don&apos;t need to save data? <Link href="/client" className="text-primary font-bold hover:underline">Continue as Guest</Link>
				</p>
			</div>
		</div>
	);
}
