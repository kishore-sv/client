"use client";

import { useStore } from "@/store/useStore";
import { IconX, IconPlus } from "@tabler/icons-react";

export function RequestTabs() {
	const { tabs, activeTabId, setActiveTab, removeTab, addTab } = useStore();

	return (
		<div className="flex items-center bg-muted/30 border-b overflow-x-auto no-scrollbar">
			{tabs.map((tab) => (
				<div
					key={tab.id}
					onClick={() => setActiveTab(tab.id)}
					className={`group flex items-center gap-2 min-w-[120px] max-w-[200px] h-9 px-3 border-r relative cursor-pointer transition-colors ${activeTabId === tab.id
							? "bg-background border-b-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
							: "hover:bg-muted"
						}`}
				>
					<span className={`text-[10px] font-bold shrink-0 ${tab.method === "GET" ? "text-green-600" :
							tab.method === "POST" ? "text-yellow-600" :
								tab.method === "PUT" ? "text-blue-600" :
									tab.method === "DELETE" ? "text-red-600" : "text-muted-foreground"
						}`}>
						{tab.method}
					</span>
					<span className="text-xs truncate flex-1 font-medium">
						{tab.name || "Untitled Request"}
					</span>
					<button
						onClick={(e) => {
							e.stopPropagation();
							removeTab(tab.id);
						}}
						className="opacity-0 group-hover:opacity-100 hover:bg-muted p-0.5 rounded transition-opacity"
					>
						<IconX className="h-3 w-3" />
					</button>
				</div>
			))}
			<button
				onClick={() => addTab()}
				className="flex items-center justify-center w-9 h-9 hover:bg-muted border-r transition-colors"
			>
				<IconPlus className="h-4 w-4" />
			</button>
		</div>
	);
}
