import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { api } from '@/utilities/config';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalBody,
    ModalFooter,
} from '@/components/ui/Modal';

interface User {
    uid: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    isMember?: boolean;
}

interface InviteTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    workbookId: string;
    onTeacherAdded: () => void;
}

const InviteTeacherModal: React.FC<InviteTeacherModalProps> = ({ isOpen, onClose, workbookId, onTeacherAdded }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingId, setAddingId] = useState<string | null>(null);

    useEffect(() => {
        const search = async () => {
            if (searchQuery.length < 3) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await api.get(`/user/search-teachers?query=${searchQuery}&workbookId=${workbookId}`);
                setResults(res.data.data || []);
            } catch (error) {
                console.error('Error searching teachers:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 500);
        return () => clearTimeout(debounce);
    }, [searchQuery, workbookId]);

    const handleInvite = async (userId: string) => {
        setAddingId(userId);
        try {
            await api.post('/membership', {
                userId,
                workbookId,
                role: 'TEACHER'
            });
            onTeacherAdded();
            // Refresh results to show joined state
            setResults(prev => prev.map(u => u.uid === userId ? { ...u, isMember: true } : u));
        } catch (error) {
            console.error('Error inviting teacher:', error);
            alert('Failed to invite teacher. They might already be a member.');
        } finally {
            setAddingId(null);
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <ModalContent size="lg" className="bg-surface border-white/10 p-0 scrollbar-hidden">
                <ModalHeader className="p-6 border-b border-white/5 space-y-1">
                    <ModalTitle className="text-[20px] font-bold text-text font-syne uppercase tracking-wider text-left">
                        Invite Collaborators
                    </ModalTitle>
                    <ModalDescription className="text-[12px] text-text-dim text-left">
                        Search for teachers by username or email
                    </ModalDescription>
                </ModalHeader>

                <ModalBody className="p-6 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
                        <input
                            type="text"
                            placeholder="Type name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text placeholder:text-text-dim focus:outline-none focus:border-amber/50 transition-all font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hidden">
                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="h-6 w-6 text-amber animate-spin" />
                                <p className="text-[11px] font-mono text-text-dim uppercase tracking-widest">Searching Database...</p>
                            </div>
                        ) : results.length > 0 ? (
                            results.map((user) => (
                                <div key={user.uid} className="group p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-amber/20 border border-amber/20 flex items-center justify-center text-amber font-bold">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                user.username.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[14px] font-bold text-text">{user.username}</p>
                                            <p className="text-[11px] text-text-dim">{user.email}</p>
                                        </div>
                                    </div>
                                    {user.isMember ? (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[12px] font-bold">
                                            Joined
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleInvite(user.uid)}
                                            disabled={addingId === user.uid}
                                            className="h-10 px-4 rounded-xl bg-amber text-bg text-[12px] font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {addingId === user.uid ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="h-4 w-4" />
                                                    Add
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : searchQuery.length >= 3 ? (
                            <div className="py-12 text-center text-text-dim italic font-light">
                                No teachers found for "{searchQuery}"
                            </div>
                        ) : searchQuery.length > 0 ? (
                            <div className="py-12 text-center text-text-dim text-[11px] font-mono uppercase tracking-widest">
                                Type at least 3 characters
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-6 w-6 text-text-dim opacity-20" />
                                </div>
                                <p className="text-text-dim italic text-[13px]">Start typing to find collaborators</p>
                            </div>
                        )}
                    </div>
                </ModalBody>

                <ModalFooter className="p-2 bg-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-white/10 text-[13px] font-bold text-text hover:bg-white/5 transition-all"
                    >
                        Done
                    </button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default InviteTeacherModal;
