import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export interface RequestTab {
	id: string;
	name: string;
	method: HttpMethod;
	url: string;
	headers: { key: string; value: string; enabled: boolean }[];
	params: { key: string; value: string; enabled: boolean }[];
	body: string;
	auth: { type: string; token: string };
	response: {
		status?: number;
		statusText?: string;
		time?: number;
		size?: string;
		body?: string;
		headers?: Record<string, string>;
		loading: boolean;
		error?: string;
	} | null;
	isDirty: boolean;
	requestId?: string;
	collectionId?: string | null;
}

export interface Collection {
	id: string;
	name: string;
	projectId?: string;
}

interface AppState {
	tabs: RequestTab[];
	activeTabId: string | null;
	sidebarOpen: boolean;
	collections: Collection[];

	// Actions
	addTab: (tab?: Partial<RequestTab>) => void;
	removeTab: (id: string) => void;
	setActiveTab: (id: string) => void;
	updateTab: (id: string, updates: Partial<RequestTab>) => void;
	updateTabResponse: (id: string, response: RequestTab["response"]) => void;
	renameTab: (id: string, newName: string) => void;
	moveRequest: (requestId: string, collectionId: string | null) => void;
	
	// Collection Actions
	addCollection: (name: string) => void;
	removeCollection: (id: string) => void;
	renameCollection: (id: string, newName: string) => void;
}

const DEFAULT_TAB: RequestTab = {
	id: "initial",
	name: "New Request",
	method: "GET",
	url: "",
	headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
	params: [],
	body: "",
	auth: { type: "bearer", token: "" },
	response: null,
	isDirty: false,
};

export const useStore = create<AppState>()(
	persist(
		(set) => ({
			tabs: [{ ...DEFAULT_TAB, id: nanoid() }],
			activeTabId: null,
			sidebarOpen: true,
			collections: [],

			addTab: (tab) => {
				const newId = nanoid();
				set((state) => ({
					tabs: [...state.tabs, { ...DEFAULT_TAB, ...tab, id: newId }],
					activeTabId: newId,
				}));
			},

			removeTab: (id) => {
				set((state) => {
					const newTabs = state.tabs.filter((t) => t.id !== id);
					let nextActiveId = state.activeTabId;
					if (state.activeTabId === id) {
						nextActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
					}
					return {
						tabs: newTabs.length > 0 ? newTabs : [{ ...DEFAULT_TAB, id: nanoid() }],
						activeTabId: newTabs.length > 0 ? nextActiveId : null,
					};
				});
			},

			setActiveTab: (id) => set({ activeTabId: id }),

			updateTab: (id, updates) => {
				set((state) => ({
					tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...updates, isDirty: true } : t)),
				}));
			},

			updateTabResponse: (id, response) => {
				set((state) => ({
					tabs: state.tabs.map((t) => (t.id === id ? { ...t, response } : t)),
				}));
			},

			renameTab: (id, newName) => {
				set((state) => ({
					tabs: state.tabs.map((t) => (t.id === id ? { ...t, name: newName } : t)),
				}));
			},

			moveRequest: (requestId, collectionId) => {
				set((state) => ({
					tabs: state.tabs.map((t) => (t.id === requestId ? { ...t, collectionId } : t)),
				}));
			},

			addCollection: (name) => {
				set((state) => ({
					collections: [...state.collections, { id: nanoid(), name }],
				}));
			},

			removeCollection: (id) => {
				set((state) => ({
					collections: state.collections.filter((c) => c.id !== id),
				}));
			},

			renameCollection: (id, newName) => {
				set((state) => ({
					collections: state.collections.map((c) => (c.id === id ? { ...c, name: newName } : c)),
				}));
			},
		}),
		{
			name: "client-storage",
			storage: createJSONStorage(() => localStorage),
			// Partial persistence: don't save loading states
			partialize: (state) => ({
				tabs: state.tabs.map(tab => ({
					...tab,
					response: tab.response ? { ...tab.response, loading: false } : null
				})),
				activeTabId: state.activeTabId,
				collections: state.collections,
				sidebarOpen: state.sidebarOpen,
			}),
		}
	)
);
