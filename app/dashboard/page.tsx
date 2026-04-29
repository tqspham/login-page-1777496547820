import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardPage(): Promise<React.ReactElement> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Dashboard</h1>
        <p className="text-gray-600 mb-6">You have successfully logged in.</p>
        <a
          href="/api/logout"
          className="inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
