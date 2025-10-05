import { redirect } from 'next/navigation';

export default function Home() {
    // Redirect immediately to /dashboard
    redirect('/dashboard');

    // This won't render because redirect stops execution
    return null;
}
