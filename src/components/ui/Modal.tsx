import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentProps<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentProps<typeof DialogPrimitive.Content> & {
        size?: "sm" | "default" | "lg" | "xl" | "full";
        showClose?: boolean;
    }
>(({ className, children, size = "default", showClose = true, ...props }, ref) => {
    const isMobile = useIsMobile();

    const sizeClasses = {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] h-[95vh]",
    };

    return (
        <ModalPortal>
            <ModalOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed left-[50%] top-[50%] z-[200] w-full translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg duration-200 flex flex-col scrollbar-hidden",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                    // Desktop styles
                    !isMobile && [
                        "rounded-lg p-6",
                        sizeClasses[size],
                        "max-h-[90vh]",
                    ],
                    // Mobile styles - full screen sheet from bottom
                    isMobile && [
                        "inset-x-0 bottom-0 top-auto translate-x-0 translate-y-0",
                        "rounded-t-[10px] border-t",
                        "max-h-[95vh]",
                        "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                    ],
                    className
                )}
                {...props}
            >
                {/* Mobile drag handle */}
                {isMobile && (
                    <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
                )}

                {children}

                {showClose && (
                    <DialogPrimitive.Close
                        className={cn(
                            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity z-20",
                            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            "disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                            isMobile && "right-4 top-6"
                        )}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </ModalPortal>
    );
});
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        sticky?: boolean;
    }
>(({ className, sticky = false, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
        <div
            ref={ref}
            className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                // Add right padding to prevent overlap with close button
                "pr-8",
                sticky && [
                    "sticky top-0 z-10 bg-background pb-4",
                    isMobile ? "-mt-4 pt-4" : "-mt-6 pt-6",
                ],
                isMobile ? "pb-4" : "pb-0",
                className
            )}
            {...props}
        />
    );
});
ModalHeader.displayName = "ModalHeader";

const ModalBody = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        scrollable?: boolean;
    }
>(({ className, scrollable = true, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
        <div
            ref={ref}
            className={cn(
                "flex-1",
                scrollable && [
                    "overflow-y-auto overscroll-contain",
                    isMobile ? "max-h-[calc(95vh-8rem)]" : "max-h-[calc(90vh-8rem)]",
                ],
                isMobile && "px-4",
                className
            )}
            {...props}
        />
    );
});
ModalBody.displayName = "ModalBody";

const ModalFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        sticky?: boolean;
    }
>(({ className, sticky = false, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
        <div
            ref={ref}
            className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                sticky && [
                    "sticky bottom-0 z-10 bg-background pt-4",
                    isMobile ? "-mb-4 pb-4" : "-mb-6 pb-6",
                ],
                isMobile ? "gap-2 pt-4" : "pt-6",
                className
            )}
            {...props}
        />
    );
});
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentProps<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentProps<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Modal,
    ModalPortal,
    ModalOverlay,
    ModalClose,
    ModalTrigger,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalTitle,
    ModalDescription,
};
