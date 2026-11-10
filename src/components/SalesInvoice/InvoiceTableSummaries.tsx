export type TableSummary = {
  key: string;
  label: string;
  value: string | number;
};

export default function InvoiceTableSummaries({
  summaries,
}: {
  summaries: TableSummary[];
}) {
  if (summaries.length === 0) return null;

  return (
    <dl className="m-1 flex flex-wrap gap-2 rounded-md bg-[#F0F5FA] p-2">
      {summaries.map(({ key, label, value }) => (
        <div key={key} className="min-w-20 flex-1 text-center">
          <dt className="text-xs font-semibold text-[#265985]">
            {label}
          </dt>
          <dd className="mt-1 rounded-sm bg-white px-2 py-1 text-xs font-semibold text-[#173B60]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}