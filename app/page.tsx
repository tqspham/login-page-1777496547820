import { LoginForm } from '@/components/LoginForm';

export default function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
