type Props = {
  appointmentsCount: number;
};
export default function OverviewCards({ appointmentsCount }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold text-blue-600">120/80</p>
        <p className="text-sm text-gray-500">Blood Pressure</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold text-green-600">72 bpm</p>
        <p className="text-sm text-gray-500">Heart Rate</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold text-purple-600">
          {appointmentsCount}
        </p>
        <p className="text-sm text-gray-500">Upcoming Appointments</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold text-red-600">₹1200</p>
        <p className="text-sm text-gray-500">Pending Bills</p>
      </div>
    </div>
  );
}
