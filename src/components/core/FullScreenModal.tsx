import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type FullScreenModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function FullScreenModal({
  open,
  onClose,
  title,
  children,
}: FullScreenModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content - full screen panel */}
          <motion.div
            className="relative w-full h-full max-w-none m-0 p-6 md:p-10 lg:p-12 overflow-auto"
            initial={{ y: 30, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full bg-white rounded-none shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  {title}
                </h2>

                <div className="flex items-center gap-2">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-200 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-slate-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden md:inline">إغلاق</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 md:p-8 overflow-auto">{children}</div>

              {/* Footer (optional) */}
              <div className="border-t border-slate-200 px-4 py-3 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition"
                >
                  غلق
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
