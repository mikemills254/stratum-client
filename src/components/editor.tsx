import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import supabase from '../utilities/supabase';

interface AwareUser {
    id: string;
    name: string;
    role: string;
    color?: string;
}

interface EditorProps {
    documentName: string;
    placeholder?: string;
    readOnly?: boolean;
    onStatusChange?: (status: 'connected' | 'connecting' | 'disconnected') => void;
    onUpdateText?: (text: string) => void;
    onUpdateAnnotations?: (annotations: any[]) => void;
    initialContent?: string;
}

export interface EditorRef {
    addAnnotation: (annotation: any) => void;
}

const Editor = forwardRef<EditorRef, EditorProps>(({
    documentName,
    placeholder = 'Start writing...',
    readOnly = false,
    onStatusChange,
    onUpdateText,
    onUpdateAnnotations,
    initialContent = ''
}, ref) => {
    const [content, setContent] = useState(initialContent);
    const [awarenessUsers, setAwarenessUsers] = useState<AwareUser[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const docRef = useRef<Y.Doc | null>(null);

    useImperativeHandle(ref, () => ({
        addAnnotation: (annotation: any) => {
            const yarray = docRef.current?.getArray('annotations');
            if (yarray) {
                docRef.current?.transact(() => {
                    const exists = yarray.toArray().some((a: any) => a.id === annotation.id);
                    if (!exists) {
                        yarray.push([annotation]);
                    }
                });
            }
        }
    }));

    useEffect(() => {
        const setupHocuspocus = async () => {
            const ydoc = new Y.Doc();
            docRef.current = ydoc;

            const provider = new HocuspocusProvider({
                url: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
                name: documentName,
                document: ydoc,
                token: (await supabase.auth.getSession()).data.session?.access_token || '',
                onStatus: ({ status }) => {
                    const s = status as 'connected' | 'connecting' | 'disconnected';
                    setStatus(s);
                    onStatusChange?.(s);
                },
                onAwarenessUpdate: ({ states }) => {
                    const users = states
                        .filter(state => state.user)
                        .map(state => ({
                            id: state.user.id,
                            name: state.user.name,
                            role: state.user.role
                        })) as AwareUser[];
                    setAwarenessUsers(users);
                },
            });

            providerRef.current = provider;

            const ytext = ydoc.getText('content');
            const yannotations = ydoc.getArray('annotations');

            // Initial sync from Yjs to state or Yjs initialization from DB
            const currentYText = ytext.toString();
            if (currentYText) {
                setContent(currentYText);
                onUpdateText?.(currentYText);
            } else if (initialContent && !readOnly) {
                // ONLY seed initial content if the editor is NOT read-only
                // This prevents teachers with stale DB data from overwriting student's live work before sync.
                ydoc.transact(() => {
                    ytext.insert(0, initialContent);
                });
                setContent(initialContent);
            } else if (initialContent && readOnly) {
                // For read-only, just set local state as a fallback until sync completes
                setContent(initialContent);
            }

            // Sync initial annotations from Yjs to parent
            if (yannotations.length > 0) {
                onUpdateAnnotations?.(yannotations.toArray());
            }

            ytext.observe(() => {
                const newText = ytext.toString();
                setContent(newText);
                onUpdateText?.(newText);
            });

            yannotations.observe(() => {
                onUpdateAnnotations?.(yannotations.toArray());
            });
        };

        setupHocuspocus();

        return () => {
            providerRef.current?.destroy();
            docRef.current?.destroy();
        };
    }, [documentName]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (readOnly) return;
        const newText = e.target.value;
        setContent(newText); // Optimistic UI update

        // Update Yjs
        const ytext = docRef.current?.getText('content');
        if (ytext) {
            docRef.current?.transact(() => {
                ytext.delete(0, ytext.length);
                ytext.insert(0, newText);
            });
        }
    };

    // Auto-resize logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleColor = (role: string) => {
        switch (role.toUpperCase()) {
            case 'DIRECTOR': return 'bg-blue-500';
            case 'TEACHER': return 'bg-emerald-500';
            case 'STUDENT': return 'bg-amber-500';
            default: return 'bg-zinc-500';
        }
    };

    return (
        <div className="relative w-full border border-white/5 rounded-xl bg-surface overflow-hidden transition-all duration-300 hover:border-white/10 flex flex-col min-h-[140px]">
            {/* Sync & Presence Header */}
            <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
                {/* Status & Mode Badges */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/5 whitespace-nowrap">
                        <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${status === 'connected'
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : status === 'connecting'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-red-500'
                            }`} />
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-dim">
                            {status === 'connected' ? 'Live' : status === 'connecting' ? 'Syncing...' : 'Offline'}
                        </span>
                    </div>

                    {readOnly && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 whitespace-nowrap">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber/80">
                                View Only
                            </span>
                        </div>
                    )}
                </div>

                {/* Presence Avatars */}
                <div className="flex items-center -space-x-1.5 overflow-hidden pointer-events-auto pr-1">
                    {awarenessUsers.map((user, idx) => (
                        <div
                            key={`${user.id}-${idx}`}
                            className={`relative h-6 w-6 rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white transition-transform hover:scale-110 cursor-help group ${getRoleColor(user.role)}`}
                        >
                            {getInitials(user.name)}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black/90 text-[9px] text-white opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none border border-white/10 backdrop-blur-md shadow-xl z-50">
                                <div className="flex flex-col items-center">
                                    <span className="font-bold">{user.name}</span>
                                    <span className="text-[8px] uppercase tracking-wider text-text-dim opacity-70">{user.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor content */}
            <div className="flex-1 w-full p-6 pt-10">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className={`w-full min-h-[100px] bg-transparent border-none outline-none resize-none text-text text-[15px] leading-relaxed placeholder:text-text-dim/50 ${readOnly ? 'opacity-80 cursor-default' : 'cursor-text'
                        }`}
                    style={{ overflow: 'hidden' }}
                />
            </div>
        </div>
    );
});

export default Editor;
