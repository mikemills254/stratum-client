import React, { useState } from 'react';
import { Loader2, Plus, Type } from 'lucide-react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalBody,
    ModalFooter,
} from '../ui/modal';
import { handleCreateQuestion } from '@/api/question';

interface CreateQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    worksheetId: string;
    onQuestionCreated: () => void;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({ isOpen, onClose, worksheetId, onQuestionCreated }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setError('Question text is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await handleCreateQuestion({
                text,
                worksheetId
            });

            if (result.success) {
                onQuestionCreated();
                onClose();
                setText('');
            } else {
                setError(result.message || 'Failed to create question');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <ModalContent size="default" className="bg-surface border-white/10 p-0 scrollbar-hidden">
                <form onSubmit={handleSubmit}>
                    <ModalHeader className="p-6 border-b border-white/5 space-y-1">
                        <ModalTitle className="text-[20px] font-bold text-text font-syne uppercase tracking-wider text-left">
                            Add Question
                        </ModalTitle>
                        <ModalDescription className="text-[12px] text-text-dim text-left">
                            Add a new question to this worksheet
                        </ModalDescription>
                    </ModalHeader>

                    <ModalBody className="p-6 space-y-5">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-mono text-amber uppercase tracking-widest pl-1">Question Text</label>
                            <div className="relative">
                                <Type className="absolute left-4 top-4 h-4 w-4 text-text-dim" />
                                <textarea
                                    placeholder="e.g. What is the derivative of x^2?"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text placeholder:text-text-dim focus:outline-none focus:border-amber/50 transition-all font-medium resize-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter className="p-6 border-t border-white/5 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-[13px] font-bold text-text hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !text.trim()}
                            className="flex-[2] px-6 py-4 rounded-2xl bg-amber text-bg text-[13px] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_8px_24px_rgba(232,160,32,0.2)]"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    <span>Add Question</span>
                                </>
                            )}
                        </button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default CreateQuestionModal;
