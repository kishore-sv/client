"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    IconPlus, 
    IconFolder, 
    IconChevronRight, 
    IconLogout, 
    IconUser, 
    IconDotsVertical, 
    IconTrash, 
    IconEdit,
    IconFolderPlus,
    IconGripVertical
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

// --- Draggable Request Item ---
function DraggableRequest({ tab, activeTabId, setActiveTab, startEditing, editingId, editValue, setEditValue, submitRename, removeTab, isNested = false }: any) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: tab.id,
        data: { type: 'request', id: tab.id }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("group relative", isDragging && "opacity-50 grayscale")}>
            <div
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                    "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all cursor-pointer",
                    isNested ? "text-[13px]" : "text-sm",
                    activeTabId === tab.id
                        ? "bg-primary/10 text-primary font-semibold shadow-sm"
                        : "hover:bg-muted text-muted-foreground/80 hover:text-foreground"
                )}
            >
                <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing hover:bg-muted-foreground/10 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconGripVertical className={cn(isNested ? "h-2.5 w-2.5" : "h-3 w-3")} />
                </div>
                
                <span className={cn("font-black text-center shrink-0 opacity-80", 
                    isNested ? "w-8 text-[8px]" : "w-10 text-[9px]",
                    tab.method === "GET" ? "text-green-500" :
                    tab.method === "POST" ? "text-amber-500" :
                    tab.method === "PUT" ? "text-blue-500" :
                    tab.method === "DELETE" ? "text-rose-500" : "text-zinc-500"
                )}>
                    {tab.method}
                </span>

                {editingId === tab.id ? (
                    <Input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => submitRename(tab.id)}
                        onKeyDown={(e) => e.key === "Enter" && submitRename(tab.id)}
                        className="h-6 text-xs px-1 py-0 bg-background border-primary/20 shadow-inner"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span 
                        className="truncate flex-1 text-left" 
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            startEditing(tab.id, tab.name);
                        }}
                    >
                        {tab.name || "Untitled Request"}
                    </span>
                )}
                
                <div className={cn("flex items-center transition-all", activeTabId === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <IconDotsVertical className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 text-xs">
                            <DropdownMenuItem onClick={() => startEditing(tab.id, tab.name)}>
                                <IconEdit className="h-3 w-3 mr-2 text-muted-foreground" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => removeTab(tab.id)}
                                className="text-destructive focus:text-destructive"
                            >
                                <IconTrash className="h-3 w-3 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

// --- Droppable Collection Item ---
function DroppableCollection({ coll, editingId, editValue, setEditValue, submitRename, startEditing, session, removeCollection, tabsInColl, setActiveTab, activeTabId, removeTab, addTab }: any) {
    const { isOver, setNodeRef } = useDroppable({
        id: coll.id,
        data: { type: 'collection', id: coll.id }
    });

    return (
        <div 
            ref={setNodeRef} 
            className={cn(
                "group flex flex-col rounded-xl transition-all duration-200 border border-transparent",
                isOver ? "bg-primary/5 border-primary/20 shadow-sm scale-[1.01]" : ""
            )}
        >
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group/header">
                <IconChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", tabsInColl.length > 0 && "rotate-90")} />
                <IconFolder className={cn("h-4 w-4 transition-colors", isOver ? "text-primary scale-110" : "text-blue-500/80")} />
                
                {editingId === coll.id ? (
                    <Input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => submitRename(coll.id, true)}
                        onKeyDown={(e) => e.key === "Enter" && submitRename(coll.id, true)}
                        className="h-6 text-xs px-1 py-0 h-fit bg-background"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="flex-1 truncate" onDoubleClick={() => startEditing(coll.id, coll.name)}>
                        {coll.name}
                    </span>
                )}

                {session && (
                    <div className="opacity-0 group-hover/header:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
                                    <IconDotsVertical className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 text-xs">
                                <DropdownMenuItem onClick={() => addTab({ collectionId: coll.id, name: "New Request" })}>
                                    <IconPlus className="h-3 w-3 mr-2 text-primary" /> New Request
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => startEditing(coll.id, coll.name)}>
                                    <IconEdit className="h-3 w-3 mr-2 text-muted-foreground" /> Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => removeCollection(coll.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <IconTrash className="h-3 w-3 mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
            
            {/* Nested items in folder */}
            <div className="ml-[1.125rem] border-l border-border/50 pl-3.5 py-1.5 flex flex-col gap-1 min-h-[4px]">
                {tabsInColl.length === 0 && !isOver && (
                    <div className="text-[10px] text-muted-foreground/30 py-2 italic font-normal">Empty folder</div>
                )}
                {tabsInColl.map((tab: any) => (
                    <DraggableRequest 
                        key={tab.id}
                        tab={tab}
                        isNested={true}
                        activeTabId={activeTabId}
                        setActiveTab={setActiveTab}
                        startEditing={startEditing}
                        editingId={editingId}
                        editValue={editValue}
                        setEditValue={setEditValue}
                        submitRename={submitRename}
                        removeTab={removeTab}
                    />
                ))}
            </div>
        </div>
    );
}

export function Sidebar() {
	const { 
        tabs, 
        activeTabId, 
        addTab, 
        setActiveTab, 
        removeTab, 
        renameTab,
        moveRequest,
        collections,
        addCollection,
        removeCollection,
        renameCollection
    } = useStore();
	const { data: session } = authClient.useSession();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleLogout = async () => {
		await authClient.signOut();
	};

    const startEditing = (id: string, currentName: string) => {
        setEditingId(id);
        setEditValue(currentName);
    };

    const submitRename = (id: string, isCollection: boolean = false) => {
        if (editValue.trim()) {
            if (isCollection) {
                renameCollection(id, editValue);
            } else {
                renameTab(id, editValue);
            }
        }
        setEditingId(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const requestId = active.id as string;
        const collectionId = over.id as string;

        if (requestId !== collectionId) {
            const isCollection = collections.some(c => c.id === collectionId);
            moveRequest(requestId, isCollection ? collectionId : null);
        }
    };

    const unorganizedTabs = tabs.filter(t => !t.collectionId);

	return (
		<div className="w-[300px] border-r h-screen flex flex-col bg-background/50 backdrop-blur-xl border-border/40 transition-all duration-300">
			<div className="p-5 flex flex-col gap-5">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-lg flex items-center gap-2.5">
						<div className="bg-primary h-7 w-7 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-black shadow-lg shadow-primary/20">
							C
						</div>
						<span className="tracking-tight">Client</span>
					</h2>
				</div>
                <div className="flex gap-2">
                    <Button onClick={() => addTab()} className="flex-1 shadow-sm rounded-lg font-bold" size="sm">
                        <IconPlus className="h-4 w-4 mr-2" /> New Request
                    </Button>
                    {session && (
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 hover:bg-muted border-border/50 rounded-lg shrink-0" 
                            onClick={() => addCollection("New Folder")}
                            title="Add Folder"
                        >
                            <IconFolderPlus className="h-4 w-4 text-blue-500" />
                        </Button>
                    )}
                </div>
			</div>

			<Separator className="opacity-30" />

			<ScrollArea className="flex-1">
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="p-4 flex flex-col gap-8">
                        <div>
                            <h3 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-5 px-2">
                                Explorer
                            </h3>
                            <div className="flex flex-col gap-4">
                                {/* Folders (Collections) */}
                                <div className="flex flex-col gap-2">
                                    {collections.map((coll) => (
                                        <DroppableCollection 
                                            key={coll.id} 
                                            coll={coll} 
                                            editingId={editingId}
                                            editValue={editValue}
                                            setEditValue={setEditValue}
                                            submitRename={submitRename}
                                            startEditing={startEditing}
                                            session={session}
                                            removeCollection={removeCollection}
                                            tabsInColl={tabs.filter(t => t.collectionId === coll.id)}
                                            setActiveTab={setActiveTab}
                                            activeTabId={activeTabId}
                                            removeTab={removeTab}
                                            addTab={addTab}
                                        />
                                    ))}
                                </div>

                                {/* Unorganized Requests Area */}
                                <div className="flex flex-col gap-0.5">
                                    {unorganizedTabs.length > 0 && (
                                        <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-2 mb-3 px-2">
                                            Saved Requests
                                        </div>
                                    )}
                                    {unorganizedTabs.map((tab) => (
                                        <DraggableRequest 
                                            key={tab.id} 
                                            tab={tab}
                                            activeTabId={activeTabId}
                                            setActiveTab={setActiveTab}
                                            startEditing={startEditing}
                                            editingId={editingId}
                                            editValue={editValue}
                                            setEditValue={setEditValue}
                                            submitRename={submitRename}
                                            removeTab={removeTab}
                                        />
                                    ))}
                                    {unorganizedTabs.length === 0 && collections.length === 0 && (
                                        <div className="text-center py-12 px-6 border-2 border-dashed rounded-2xl border-border/50 bg-muted/5 group hover:border-primary/20 hover:bg-muted/10 transition-all cursor-pointer" onClick={() => addTab()}>
                                            <p className="text-xs text-muted-foreground font-medium">Create your first request</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DndContext>
			</ScrollArea>

			<div className="p-5 mt-auto border-t bg-muted/30 border-border/40">
				{session ? (
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3.5 px-1 py-0.5">
							<div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-inner">
								{session.user.image ? (
									<img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
								) : (
									<IconUser className="h-4.5 w-4.5" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-[13px] font-bold truncate leading-none mb-1">{session.user.name}</p>
								<p className="text-[10px] text-muted-foreground truncate opacity-70">{session.user.email}</p>
							</div>
							<Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors">
								<IconLogout className="h-3.5 w-3.5" />
							</Button>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						<p className="text-[11px] text-muted-foreground/70 px-1 text-center font-medium">Connect to sync your collections</p>
						<Button asChild size="sm" className="w-full text-xs font-black shadow-lg shadow-primary/10 h-9 rounded-lg">
							<Link href="/login">Login with Client</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
