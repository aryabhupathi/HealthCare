type Props = {
  notifications: string[];
};
export default function Notifications({ notifications }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <ul className="space-y-2 text-sm">
        {notifications.map((note, i) => (
          <li key={i} className="text-gray-700">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
