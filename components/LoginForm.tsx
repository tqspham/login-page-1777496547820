"use client";

import { FormEvent, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface FormErrors {
  emailOrUsername?: string;
  password?: string;
  submit?: string;
}

export function LoginForm(): React.ReactElement {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ emailOrUsername?: boolean; password?: boolean }>({});
  const emailInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email or username is required';
    } else if (
      emailOrUsername.includes('@') &&
      !validateEmail(emailOrUsername)
    ) {
      newErrors.emailOrUsername = 'Please enter a valid email address';
    } else if (
      emailOrUsername.length < 3 ||
      emailOrUsername.length > 254
    ) {
      newErrors.emailOrUsername = 'Email or username must be between 3 and 254 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'emailOrUsername' | 'password'): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const newErrors: FormErrors = { ...errors };
    if (field === 'emailOrUsername') {
      if (!emailOrUsername.trim()) {
        newErrors.emailOrUsername = 'Email or username is required';
      } else if (
        emailOrUsername.includes('@') &&
        !validateEmail(emailOrUsername)
      ) {
        newErrors.emailOrUsername = 'Please enter a valid email address';
      } else {
        delete newErrors.emailOrUsername;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm() || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername,
          password,
        }),
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        setErrors({ submit: data.error || 'Invalid email or password' });
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setErrors({ submit: message });
      setIsLoading(false);
    }
  };

  const hasEmailError = touched.emailOrUsername && errors.emailOrUsername;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-8 shadow-lg">
      {errors.submit && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200"
        >
          {errors.submit}
        </div>
      )}

      <div>
        <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-1">
          Email or Username
        </label>
        <input
          ref={emailInputRef}
          id="emailOrUsername"
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          onBlur={() => handleBlur('emailOrUsername')}
          autoComplete="username"
          disabled={isLoading}
          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${
            hasEmailError
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white'
          }`}
          aria-invalid={hasEmailError ? 'true' : 'false'}
          aria-describedby={hasEmailError ? 'emailOrUsername-error' : undefined}
        />
        {hasEmailError && (
          <p id="emailOrUsername-error" className="mt-1 text-sm text-red-600">
            {errors.emailOrUsername}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && emailOrUsername && password) {
                e.currentTarget.form?.dispatchEvent(
                  new Event('submit', { bubbles: true, cancelable: true })
                );
              }
            }}
            autoComplete="current-password"
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            aria-invalid={touched.password && errors.password ? 'true' : 'false'}
            aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-label="Log in with email and password"
        className="w-full rounded-md bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Logging in...</span>
          </>
        ) : (
          'Log In'
        )}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/forgot-password"
          className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
        >
          Forgot Password?
        </Link>
        <Link
          href="/sign-up"
          className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}
