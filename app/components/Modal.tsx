import { ReactNode } from "react";

export function Modal({
  actions,
  children,
  className = "",
}: {
  actions: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className={`modal-panel ${className}`.trim()} role="dialog">
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-actions-bottom">
          {actions}
        </div>
      </section>
    </div>
  );
}
