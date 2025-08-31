type Prescription = {
  name: string;
  duration: string;
};
type Props = {
  prescriptions: Prescription[];
};
export default function Prescriptions({ prescriptions }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Prescriptions</h2>
      <ul className="space-y-3">
        {prescriptions.map((med, i) => (
          <li
            key={i}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >
            <span>{med.name}</span>
            <span className="text-xs text-gray-500">{med.duration}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
