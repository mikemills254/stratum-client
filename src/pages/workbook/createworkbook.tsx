import { Plus, Loader2 } from "lucide-react"
import { useState } from "react"
import { handleCreateWorkBook } from "@/api/workbook"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal"

export const CreateWorkBook: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string>("")
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            tag: ""
        },
        onSubmit: async (values, { setSubmitting }) => {
            if (!values.name) {
                toast.error("Name is required");
                return;
            }

            setSubmitting(true);
            try {
                const response = await handleCreateWorkBook(values);
                if (!response.success) {
                    setError(response.message)
                    return
                } else {
                    navigate(`/workbook/${response.data?.id}`)
                }
            } catch (error) {
                toast.error("An error occurred while creating the workbook");
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex cursor-pointer items-center gap-2.5 px-6 py-3.5 bg-gradient-to-br from-amber to-[#ff6b35] text-white rounded-md font-bold shadow-[0_8px_32px_rgba(232,160,32,0.3)] transition-all hover:scale-105 active:scale-95"
            >
                <Plus className="h-5 w-5" />
                <span>Create Workbook</span>
            </button>

            <Modal open={isOpen} onOpenChange={setIsOpen}>
                <ModalContent size="lg" className="bg-[#0a0a0a] border-white/[0.08] backdrop-blur-xl scrollbar-hidden">
                    <ModalHeader className="pb-8">
                        <ModalTitle className="text-2xl font-bold tracking-tight text-white">New Workbook</ModalTitle>
                    </ModalHeader>

                    {
                        error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )
                    }

                    <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 min-h-0">
                        <ModalBody className="space-y-6 px-2 scrollbar-hidden" scrollable={true}>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 ml-1">
                                    Workbook Name
                                </label>
                                <input
                                    autoFocus
                                    name="name"
                                    className="flex h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber/50 focus-visible:border-amber/50"
                                    placeholder="e.g. Advanced Mathematics"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 ml-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    className="flex min-h-[100px] w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber/50 focus-visible:border-amber/50 resize-none"
                                    placeholder="What's this workbook about?"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 ml-1">
                                    Category Tag
                                </label>
                                <input
                                    name="tag"
                                    className="flex h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber/50 focus-visible:border-amber/50"
                                    placeholder="e.g. Science, Math, History"
                                    value={formik.values.tag}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter className="pt-10 gap-3 sm:space-x-0">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex flex-1 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white hover:bg-white/[0.05] h-12 px-6"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="inline-flex flex-[2] items-center justify-center rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 bg-gradient-to-br from-amber to-[#ff6b35] text-white hover:opacity-90 hover:shadow-[0_8px_32px_rgba(232,160,32,0.3)] hover:scale-[1.02] active:scale-[0.98] h-12 px-6"
                            >
                                {formik.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Workbook
                            </button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateWorkBook
