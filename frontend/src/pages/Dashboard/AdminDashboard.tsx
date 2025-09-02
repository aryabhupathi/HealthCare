export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <p className="text-gray-500">Patients Today</p>
            <h2 className="text-2xl font-bold text-green-600">120</h2>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <p className="text-gray-500">Appointments</p>
            <h2 className="text-2xl font-bold text-blue-600">75</h2>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <p className="text-gray-500">Doctors on Duty</p>
            <h2 className="text-2xl font-bold text-purple-600">18</h2>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <p className="text-gray-500">Revenue</p>
            <h2 className="text-2xl font-bold text-red-600">₹2,45,000</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow col-span-2">
            <h3 className="text-lg font-semibold mb-3">Hospital Calendar</h3>
            <div className="h-56 flex items-center justify-center text-gray-400">
              📅 [Calendar Widget Placeholder]
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-3">Low Stock Alerts</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Paracetamol</span>
                <span className="text-red-600">5 left</span>
              </li>
              <li className="flex justify-between">
                <span>Insulin</span>
                <span className="text-red-600">12 left</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-3">Recent Patients</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Age</th>
                  <th className="pb-2">Department</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td>Rahul Sharma</td>
                  <td>35</td>
                  <td>Cardiology</td>
                </tr>
                <tr className="border-b">
                  <td>Anita Desai</td>
                  <td>42</td>
                  <td>Neurology</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-3">Pending Bills</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td>Ravi Kumar</td>
                  <td>₹5,000</td>
                  <td className="text-red-600">Unpaid</td>
                </tr>
                <tr className="border-b">
                  <td>Sunita Patel</td>
                  <td>₹12,000</td>
                  <td className="text-yellow-600">Insurance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
