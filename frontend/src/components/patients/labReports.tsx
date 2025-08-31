type Report = {
  name: string;
};
type Props = {
  reports: Report[];
};
export default function LabReports({ reports }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Lab Reports</h2>
      <ul className="space-y-3">
        {reports.map((rep, i) => (
          <li
            key={i}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >
            <span>{rep.name}</span>
            <button className="text-sm text-blue-600 hover:underline">
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
