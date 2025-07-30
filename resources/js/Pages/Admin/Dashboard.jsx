import Navbar from '@/components/Navbar';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the admin panel.</p>
      </div>
    </>
  );
}
