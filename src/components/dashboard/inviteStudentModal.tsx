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
} from '@/components/ui/modal';

import type { IUser } from '@/types/users';

interface InviteStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    workbookId: string;
    onStudentAdded: () => void;
}

const InviteStudentModal: React.FC<InviteStudentModalProps> = ({ isOpen, onClose, workbookId, onStudentAdded }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<IUser[]>([]);
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
                const res = await api.get(`/user/search-students?query=${searchQuery}&workbookId=${workbookId}`);
                setResults(res.data.data || []);
            } catch (error) {
                console.error('Error searching students:', error);
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
            await api.post('/membership/assign-student', {
                studentId: userId,
                workbookId
            });
            onStudentAdded();
            // Refresh results to show joined state
            setResults(prev => prev.map(u => u.uid === userId ? { ...u, isMember: true } : u));
        } catch (error) {
            console.error('Error inviting student:', error);
            alert('Failed to invite student. They might already be a member.');
        } finally {
            setAddingId(null);
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <ModalContent size="lg" className="bg-surface border-black/10 p-0 scrollbar-hidden">
                <ModalHeader className="p-6 border-b border-black/5 space-y-1">
                    <ModalTitle className="text-[20px] font-bold text-text font-syne uppercase tracking-wider text-left">
                        Invite Students
                    </ModalTitle>
                    <ModalDescription className="text-[12px] text-text-dim text-left">
                        Search for students by username or email to grant access to this workbook.
                    </ModalDescription>
                </ModalHeader>

                <ModalBody className="p-6 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
                        <input
                            type="text"
                            placeholder="Type student name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-text placeholder:text-text-dim focus:outline-none focus:border-amber/50 transition-all font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="h-6 w-6 text-amber animate-spin" />
                                <p className="text-[11px] font-mono text-text-dim uppercase tracking-widest">Searching Students...</p>
                            </div>
                        ) : results.length > 0 ? (
                            results.map((user: IUser) => (
                                <div key={user.uid} className="group p-4 bg-black/5 border border-black/5 rounded-2xl flex items-center justify-between hover:bg-black/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
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
                                            Enrolled
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
                                                    Enroll
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : searchQuery.length >= 3 ? (
                            <div className="py-12 text-center text-text-dim italic font-light">
                                No students found for "{searchQuery}"
                            </div>
                        ) : searchQuery.length > 0 ? (
                            <div className="py-12 text-center text-text-dim text-[11px] font-mono uppercase tracking-widest">
                                Type at least 3 characters
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="h-12 w-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-6 w-6 text-text-dim opacity-20" />
                                </div>
                                <p className="text-text-dim italic text-[13px]">Find students to invite to this workbook</p>
                            </div>
                        )}
                    </div>
                </ModalBody>

                <ModalFooter className="p-4 bg-black/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-black/10 text-[13px] font-bold text-text hover:bg-black/5 transition-all"
                    >
                        Done
                    </button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default InviteStudentModal;
