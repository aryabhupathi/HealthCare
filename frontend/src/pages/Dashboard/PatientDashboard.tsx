export default function PatientDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome Back, Arya 👋
        </h1>
        <p className="text-gray-500 mt-2 md:mt-0">
          Last login: Aug 31, 2025 – 10:30 AM
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card
          title="Upcoming Appointment"
          value="5th Sep, 4:00 PM"
          action="Reschedule"
        />
        <Card
          title="Medications"
          value="Metformin (3 days left)"
          action="Request Refill"
        />
        <Card
          title="Test Results"
          value="Blood Sugar: Normal"
          action="View Reports"
        />
        <Card title="Billing" value="₹500 Due" action="Pay Now" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Health Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <VitalBox
              label="Blood Pressure"
              value="120/80 mmHg"
              status="Normal"
            />
            <VitalBox label="Heart Rate" value="78 bpm" status="Normal" />
            <VitalBox label="Blood Sugar" value="110 mg/dL" status="Normal" />
            <VitalBox label="Weight" value="68 kg" status="Stable" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Notifications
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
              <span>Annual Health Check-up due on 10th Sep</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
              <span>Lab results updated – Blood Sugar Test</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-2"></span>
              <span>Vaccination reminder: Flu Shot</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Messages</h2>
          <div className="space-y-3">
            <MessageItem
              from="Dr. Sharma"
              message="Please monitor your sugar levels this week."
              time="2h ago"
            />
            <MessageItem
              from="Lab Support"
              message="Your blood report is available for download."
              time="1d ago"
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Quick Help
            </h2>
            <p className="text-gray-600 mb-4">
              Need urgent medical support? Reach us right away.
            </p>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition">
            🚑 Emergency Contact
          </button>
        </div>
      </div>
    </div>
  );
}
function Card({
  title,
  value,
  action,
}: {
  title: string;
  value: string;
  action?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
      {action && (
        <button className="mt-3 text-blue-600 text-sm hover:underline">
          {action}
        </button>
      )}
    </div>
  );
}
function VitalBox({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
      <p className="text-xs text-green-600">{status}</p>
    </div>
  );
}
function MessageItem({
  from,
  message,
  time,
}: {
  from: string;
  message: string;
  time: string;
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="font-medium text-gray-800">{from}</p>
      <p className="text-sm text-gray-600">{message}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  );
}
