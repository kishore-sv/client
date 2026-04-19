"use client";

import { Sidebar } from "@/components/features/sidebar/Sidebar";
import { RequestTabs } from "@/components/features/request/RequestTabs";
import { RequestBuilder } from "@/components/features/request/RequestBuilder";
import { ResponseViewer } from "@/components/features/response/ResponseViewer";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function ClientPage() {
	const { tabs, activeTabId, setActiveTab } = useStore();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		if (!activeTabId && tabs.length > 0) {
			setActiveTab(tabs[0].id);
		}
	}, [activeTabId, tabs, setActiveTab]);

	if (!mounted) {
		return <div className="h-screen w-screen bg-background" />;
	}

	return (
		<div className="flex h-screen bg-background overflow-hidden">
			<Sidebar />
			
			<main className="flex-1 flex flex-col min-w-0">
				<RequestTabs />
				
				<div className="flex-1 flex flex-col min-h-0">
					{/* Request Section */}
					<div className="flex-[0.5] min-h-0 border-b">
						<RequestBuilder />
					</div>
					
					{/* Response Section */}
					<div className="flex-[0.5] min-h-0">
						<ResponseViewer />
					</div>
				</div>
			</main>
		</div>
	);
}
