// import { useEffect, useState } from "react";
// type Patient = {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   address?: string;
// };
// export default function Profile() {
//   const [patient, setPatient] = useState<Patient | null>(null);
//   const [editing, setEditing] = useState(false);
//   const [form, setForm] = useState({ name: "", phone: "", address: "" });
//   useEffect(() => {
//     fetch("http://localhost:5000/api/patients/me", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setPatient(data);
//         setForm({
//           name: data.name,
//           phone: data.phone || "",
//           address: data.address || "",
//         });
//       });
//   }, []);
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };
//   const handleSave = async () => {
//     const res = await fetch("http://localhost:5000/api/patients/me", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) {
//       const updated = await res.json();
//       setPatient(updated.user);
//       setEditing(false);
//     }
//   };
//   // if (!patient) return <p>Loading...</p>;
//   return (
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
//       <h1 className="text-2xl font-bold mb-4">My Profile</h1>
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Name</label>
//           {editing ? (
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           ) : (
//             // <p>{patient.name}</p>
//             <p>aaa</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           {/* <p>{patient.email}</p> */}
//           <p>bbb</p>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Phone</label>
//           {editing ? (
//             <input
//               type="text"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           ) : (
//             // <p>{patient.phone || "Not provided"}</p>
//             <p>ccc</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Address</label>
//           {editing ? (
//             <input
//               type="text"
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           ) : (
//             // <p>{patient.address || "Not provided"}</p>
//             <p>dddd</p>
//           )}
//         </div>
//       </div>
//       <div className="mt-6 flex gap-3">
//         {editing ? (
//           <>
//             <button
//               onClick={handleSave}
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditing(false)}
//               className="bg-gray-200 px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={() => setEditing(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Edit Profile
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PatientProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const {user} = useAuth();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:1111/patient/${user?._id}/profile`, {
          credentials: "include",
        });
        const data = await res.json();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return <p className="p-6">No profile data available</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl space-y-6">
        <ProfileItem label="Full Name" value={profile.name} />
        <ProfileItem label="Email" value={profile.email} />
        <ProfileItem label="Phone" value={profile.phone || "-"} />
        <ProfileItem label="Date of Birth" value={profile.dob || "-"} />
        <ProfileItem label="Gender" value={profile.gender || "-"} />
        <ProfileItem label="Blood Group" value={profile.bloodGroup || "-"} />
        <ProfileItem label="Address" value={profile.address || "-"} />
        <ProfileItem label="Emergency Contact" value={profile.emergencyContact || "-"} />
        <ProfileItem label="Patient ID" value={profile._id} />
        <ProfileItem label="Primary Doctor" value={profile.primaryDoctor || "Not Assigned"} />
      </div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
