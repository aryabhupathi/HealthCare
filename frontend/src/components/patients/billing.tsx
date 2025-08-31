import { useEffect, useState } from "react";

interface Bill {
  _id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Pending";
}

export default function BillsTab({ patientId }: { patientId: string }) {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(`http://localhost:1111/patient/${patientId}/bills`);
        const data = await res.json();
        if (data.success) setBills(data.data);
      } catch (err) {
        console.error("Error fetching bills", err);
      }
    };
    fetchBills();
  }, [patientId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Bills & Payments</h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bills.length > 0 ? (
              bills.map((bill) => (
                <tr key={bill._id} className="border-b">
                  <td className="px-6 py-4">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{bill.description}</td>
                  <td className="px-6 py-4 font-medium">₹{bill.amount}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      bill.status === "Paid"
                        ? "text-green-600"
                        : bill.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {bill.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                  No bills available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
