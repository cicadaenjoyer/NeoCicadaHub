import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface ContactDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Renders a contact information modal dialog.
 * Displays LinkedIn and email contact links in a centered overlay with a semi-transparent backdrop.
 * The dialog can be closed by clicking the close button, clicking the backdrop, or pressing the Escape key.
 *
 * @param {Object} props - The props for ContactDialog.
 * @param {boolean} props.isOpen - Controls whether the dialog is visible.
 * @param {() => void} props.onClose - Callback function to execute when the dialog is closed.
 * @returns {JSX.Element} The contact dialog component.
 */
function ContactDialog({ isOpen, onClose }: ContactDialogProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            style={{ position: "relative", zIndex: 9999 }}
        >
            {/* Backdrop */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    zIndex: 9999,
                }}
                aria-hidden="true"
            />

            {/* Full-screen container to center the panel */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    zIndex: 10000,
                }}
            >
                <DialogPanel className="contact-dialog">
                    <DialogTitle className="dialog-title">
                        Get in Touch
                    </DialogTitle>

                    <div className="dialog-content">
                        <a
                            href="https://www.linkedin.com/in/abrahamh-dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <svg
                                className="contact-icon"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LinkedIn
                        </a>

                        <a
                            href="mailto:abehernandez@work.com"
                            className="contact-link"
                        >
                            <svg
                                className="contact-icon"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Email
                        </a>
                    </div>

                    <button onClick={onClose} className="close-button">
                        Close
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default ContactDialog;
