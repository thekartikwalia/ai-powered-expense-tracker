import LogoutButton from '../../components/LogoutButton';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
        <h1 className="text-xl font-bold text-black">Expense Tracker</h1>
        <LogoutButton />
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
