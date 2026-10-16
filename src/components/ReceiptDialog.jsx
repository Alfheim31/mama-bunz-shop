import { useEffect, useRef } from "react";

/* Shows the same receipt that was emailed, with print / save as PDF. */
export default function ReceiptDialog({ open, html, number, onClose }) {
  const ref = useRef(null);
  const frame = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const print = () => frame.current?.contentWindow?.print();

  return (
    <dialog ref={ref} className="receipt-dialog" aria-label={`Receipt ${number}`} onClose={onClose}>
      <div className="receipt-bar">
        <span>Receipt {number}</span>
        <div>
          <button className="btn btn-quiet" onClick={print}>Print or save PDF</button>
          <button className="close-btn" onClick={onClose} aria-label="Close receipt">×</button>
        </div>
      </div>
      <iframe ref={frame} title={`Receipt ${number}`} srcDoc={html} />
    </dialog>
  );
}
