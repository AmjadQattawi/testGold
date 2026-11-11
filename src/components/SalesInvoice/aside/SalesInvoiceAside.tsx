import InvoicePaymentCard from "./InvoicePaymentCard";
import InvoiceSettlementCard from "./InvoiceSettlementCard";
// import Notes from "./Notes";

export default function SalesInvoiceAside() {
  return (
    <aside className="col-span-3 flex min-h-0 min-w-0 flex-col gap-2 rounded-md border border-slate-200">
      {/* <Notes /> */}
      <InvoicePaymentCard />
      <InvoiceSettlementCard />
    </aside>
  );
}
