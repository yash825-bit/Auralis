export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold text-gray-700">Auralis</h1>
      <nav className="flex gap-4 text-gray-600">
        <a href="#">Home</a>
        <a href="#">About</a>
      </nav>
    </header>
  );
}
