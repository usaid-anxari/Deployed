import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "blue",
  isLoading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-600 text-white hover:bg-blue-700",
    red: "bg-red-600 text-white hover:bg-red-700",
    green: "bg-green-600 text-white hover:bg-green-700",
  };

  const handleConfirm = async () => {
    if (!isLoading) {
      try {
        await onConfirm();
        // Don't close here - let the parent handle it
      } catch (error) {
        console.error("Confirmation failed:", error);
      }
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${colorClasses[confirmColor]}`}
                    onClick={handleConfirm}
                  >
                    {isLoading ? "Processing..." : confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
