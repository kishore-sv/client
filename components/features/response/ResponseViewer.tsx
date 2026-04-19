"use client";

import { useStore } from "@/store/useStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export function ResponseViewer() {
	const { tabs, activeTabId } = useStore();
	const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
	const [copied, setCopied] = useState(false);
	const { theme } = useTheme();

	const response = activeTab.response;

	if (!response) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground border-t bg-muted/20">
				Hit "Send" to get a response
			</div>
		);
	}

	if (response.loading) {
		return (
			<div className="flex items-center justify-center h-full border-t bg-muted/20">
				<div className="flex flex-col items-center gap-2">
					<div className="animate-pulse text-primary font-medium">Executing request...</div>
				</div>
			</div>
		);
	}

	if (response.error) {
		return (
			<div className="p-6 border-t bg-red-50/10 h-full overflow-auto">
				<div className="text-red-500 font-bold mb-2">Error</div>
				<pre className="text-sm bg-red-50 p-4 rounded border border-red-100 whitespace-pre-wrap">
					{response.error}
				</pre>
			</div>
		);
	}

	const handleCopy = () => {
		const text = typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2);
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const getStatusColor = (status: number) => {
		if (status >= 200 && status < 300) return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
		if (status >= 400 && status < 500) return "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200";
		if (status >= 500) return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
		return "bg-gray-100 text-gray-700";
	};

	return (
		<div className="flex flex-col h-full border-t">
			<div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
				<div className="flex gap-4 items-center text-sm">
					<div className="flex items-center gap-1.5">
						<span className="text-muted-foreground">Status:</span>
						<Badge variant="outline" className={getStatusColor(response.status || 0)}>
							{response.status} {response.statusText}
						</Badge>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="text-muted-foreground">Time:</span>
						<span className="font-medium text-green-600">{response.time} ms</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="text-muted-foreground">Size:</span>
						<span className="font-medium text-blue-600">{response.size}</span>
					</div>
				</div>
				<Button variant="ghost" size="sm" onClick={handleCopy}>
					{copied ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
				</Button>
			</div>

			<Tabs defaultValue="body" className="flex-1 flex flex-col">
				<div className="px-4">
					<TabsList className="h-9 mt-2">
						<TabsTrigger value="body">Body</TabsTrigger>
						<TabsTrigger value="headers">Headers</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="body" className="flex-1 mt-2 border-t overflow-hidden">
					<Editor
						height="100%"
						defaultLanguage="json"
						theme={theme === "dark" ? "vs-dark" : "vs-light"}
						value={
							typeof response.body === "string"
								? response.body
								: JSON.stringify(response.body, null, 2)
						}
						options={{
							readOnly: true,
							minimap: { enabled: false },
							fontSize: 13,
							scrollBeyondLastLine: false,
							lineNumbers: "on",
						}}
					/>
				</TabsContent>

				<TabsContent value="headers" className="flex-1 mt-2 border-t overflow-auto p-4">
					<div className="flex flex-col gap-2">
						{Object.entries(response.headers || {}).map(([k, v]) => (
							<div key={k} className="flex gap-4 border-b border-muted py-1 last:border-0">
								<div className="font-medium text-sm w-48 shrink-0">{k}</div>
								<div className="text-sm text-muted-foreground break-all">{String(v)}</div>
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
