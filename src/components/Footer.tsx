import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Drivant Store';

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6">
              <Image
                src="/logo-icon.png"
                alt="Drivant"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              &copy; {year} {storeName}. Todos los derechos reservados.
            </span>
          </div>
          <div className="flex gap-6 text-xs font-medium text-gray-500">
            <a href="#" className="transition-colors hover:text-orange-600">
              Términos de Servicio
            </a>
            <a href="#" className="transition-colors hover:text-orange-600">
              Garantía y Entrega
            </a>
            <a href="#" className="transition-colors hover:text-orange-600">
              Soporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
