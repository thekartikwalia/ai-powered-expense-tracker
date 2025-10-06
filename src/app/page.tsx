import { redirect } from 'next/navigation';

export default function Home() {
    // Redirect immediately to /dashboard
    redirect('/expenses');

    // This won't render because redirect stops execution
    return null;
}
