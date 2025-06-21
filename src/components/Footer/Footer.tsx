export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 p-4 text-center mt-8">
      © {new Date().getFullYear()} My Blog. Все права защищены.
    </footer>
  );
}
