import { useState } from "react";
import { ConfirmDialog } from "./Modal";

interface AskOptions {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
}

/** Small helper so any component can ask "are you sure?" without its own state. */
export function useConfirm() {
  const [request, setRequest] = useState<AskOptions | null>(null);

  const ask = (options: AskOptions) => setRequest(options);

  const dialog = request ? (
    <ConfirmDialog
      title={request.title}
      body={request.body}
      confirmLabel={request.confirmLabel}
      danger={request.danger}
      onCancel={() => setRequest(null)}
      onConfirm={() => {
        request.onConfirm();
        setRequest(null);
      }}
    />
  ) : null;

  return { ask, dialog };
}
