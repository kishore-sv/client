"use client";

import { useStore, HttpMethod } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { IconSend, IconLoader2, IconPlus, IconTrash, IconFileDownload } from "@tabler/icons-react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export function RequestBuilder() {
	const { tabs, activeTabId, updateTab, updateTabResponse } = useStore();
	const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
	const { data: session } = authClient.useSession();

	const { theme } = useTheme();


	const [url, setUrl] = useState(activeTab.url);

	useEffect(() => {
		setUrl(activeTab.url);
	}, [activeTab.id, activeTab.url]);

	const handleSend = async () => {
		if (!activeTab) return;

		updateTabResponse(activeTab.id, { loading: true });

		try {
			const res = await axios.post("/api/proxy", {
				method: activeTab.method,
				url: activeTab.url,
				headers: activeTab.headers,
				body: activeTab.body,
			});

			updateTabResponse(activeTab.id, {
				...res.data,
				loading: false,
			});
		} catch (err: any) {
			updateTabResponse(activeTab.id, {
				loading: false,
				error: err.response?.data?.error || err.message,
			});
		}
	};

	const handleSave = async () => {
		if (!session) {
			alert("Please login to save requests");
			return;
		}
		// logic to save to DB via API
		console.log("Saving request...", activeTab);
	};

	const addHeader = () => {
		updateTab(activeTab.id, {
			headers: [...activeTab.headers, { key: "", value: "", enabled: true }],
		});
	};

	const removeHeader = (index: number) => {
		updateTab(activeTab.id, {
			headers: activeTab.headers.filter((_, i) => i !== index),
		});
	};

	const updateHeader = (index: number, field: "key" | "value" | "enabled", value: any) => {
		const newHeaders = [...activeTab.headers];
		newHeaders[index] = { ...newHeaders[index], [field]: value };
		updateTab(activeTab.id, { headers: newHeaders });
	};

	const getMethodColor = (method: string) => {
		switch (method) {
			case "GET": return "text-green-600";
			case "POST": return "text-yellow-600";
			case "PUT": return "text-blue-600";
			case "DELETE": return "text-red-600";
			case "PATCH": return "text-purple-600";
			default: return "text-muted-foreground";
		}
	};

	return (
		<div className="flex flex-col gap-4 p-4 h-full">
			<div className="flex gap-2">
				<Select
					value={activeTab.method}
					onValueChange={(val: HttpMethod) => updateTab(activeTab.id, { method: val })}
				>
					<SelectTrigger className={`w-[120px] font-bold ${getMethodColor(activeTab.method)}`}>
						<SelectValue placeholder="Method" />
					</SelectTrigger>
					<SelectContent>
						{["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].map((m) => (
							<SelectItem key={m} value={m} className={`font-bold ${getMethodColor(m)}`}>
								{m}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					placeholder="https://api.example.com/endpoint"
					value={url}
					onChange={(e) => {
						setUrl(e.target.value);
						updateTab(activeTab.id, { url: e.target.value });
					}}
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
					className="flex-1"
				/>
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleSave} size="icon" title="Save Request">
						<IconFileDownload className="h-4 w-4" />
					</Button>
					<Button onClick={handleSend} disabled={activeTab.response?.loading} className="px-6">
						{activeTab.response?.loading ? (
							<IconLoader2 className="h-4 w-4 animate-spin mr-2" />
						) : (
							<IconSend className="h-4 w-4 mr-2" />
						)}
						Send
					</Button>
				</div>
			</div>

			<Tabs defaultValue="params" className="flex-1 flex flex-col">
				<TabsList className="justify-start">
					<TabsTrigger value="params">Params</TabsTrigger>
					<TabsTrigger value="headers">Headers</TabsTrigger>
					<TabsTrigger value="body">Body</TabsTrigger>
					<TabsTrigger value="auth">Auth</TabsTrigger>
				</TabsList>

				<TabsContent value="params" className="flex-1 mt-4">
					<div className="text-sm text-muted-foreground">Query parameters coming soon...</div>
				</TabsContent>

				<TabsContent value="headers" className="flex-1 mt-4 overflow-auto">
					<div className="flex flex-col gap-2">
						{activeTab.headers.map((h, i) => (
							<div key={i} className="flex gap-2 items-center">
								<input
									type="checkbox"
									checked={h.enabled}
									onChange={(e) => updateHeader(i, "enabled", e.target.checked)}
									className="h-4 w-4"
								/>
								<Input
									placeholder="Key"
									value={h.key}
									onChange={(e) => updateHeader(i, "key", e.target.value)}
									className="h-9"
								/>
								<Input
									placeholder="Value"
									value={h.value}
									onChange={(e) => updateHeader(i, "value", e.target.value)}
									className="h-9"
								/>
								<Button variant="ghost" size="icon" onClick={() => removeHeader(i)}>
									<IconTrash className="h-4 w-4" />
								</Button>
							</div>
						))}
						<Button variant="outline" size="sm" onClick={addHeader} className="w-fit mt-2">
							<IconPlus className="h-4 w-4 mr-2" /> Add Header
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="body" className="flex-1 mt-4 border rounded-md overflow-hidden min-h-[200px]">
					<Editor
						height="100%"
						defaultLanguage="json"
						theme={theme === "dark" ? "vs-dark" : "vs-light"}
						value={activeTab.body}
						onChange={(val) => updateTab(activeTab.id, { body: val || "" })}
						options={{
							minimap: { enabled: false },
							fontSize: 14,
							scrollBeyondLastLine: false,
						}}
					/>
				</TabsContent>

				<TabsContent value="auth" className="flex-1 mt-4">
					<div className="flex flex-col gap-4">
						<Select
							value={activeTab.auth.type}
							onValueChange={(val) =>
								updateTab(activeTab.id, { auth: { ...activeTab.auth, type: val } })
							}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Auth Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No Auth</SelectItem>
								<SelectItem value="bearer">Bearer Token</SelectItem>
							</SelectContent>
						</Select>

						{activeTab.auth.type === "bearer" && (
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Token</label>
								<Input
									placeholder="Paste token here"
									value={activeTab.auth.token}
									onChange={(e) =>
										updateTab(activeTab.id, { auth: { ...activeTab.auth, token: e.target.value } })
									}
								/>
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
