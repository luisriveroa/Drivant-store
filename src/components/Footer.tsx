import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Drivant Store';

  return (
    <footer className="bg-[#16141F]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6">
              <Image
                src="/logo-isotipo-blanco.svg"
                alt=""
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-sm font-semibold text-[#F4F1EA]">
              &copy; {year} {storeName}. Todos los derechos reservados.
            </span>
          </div>
          <div className="flex gap-6 text-xs font-medium text-gray-300">
            <a href="#" className="transition-colors hover:text-lime-400">
              Términos de Servicio
            </a>
            <a href="#" className="transition-colors hover:text-lime-400">
              Garantía y Entrega
            </a>
            <a href="#" className="transition-colors hover:text-lime-400">
              Soporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
