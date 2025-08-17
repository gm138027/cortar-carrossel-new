import Link from 'next/link';

const MobileSidebar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-white/95 backdrop-blur-md shadow-lg p-3 border-t border-indigo-100">
        <div className="flex overflow-x-auto pb-1 space-x-4">
          <Link href="/cortar-carrossel-infinito" className="whitespace-nowrap text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-full flex-shrink-0 hover:bg-indigo-100">
            Cortar Carrossel Infinito
          </Link>
          <Link href="/cortar-imagem-carrossel" className="whitespace-nowrap text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-full flex-shrink-0 hover:bg-indigo-100">
            Cortar Imagem Carrossel
          </Link>
          <Link href="/image-splitter-online" className="whitespace-nowrap text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-full flex-shrink-0 hover:bg-indigo-100">
            ImageSplitter Online
          </Link>
          <Link href="/dividir-imagem-carrossel" className="whitespace-nowrap text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-full flex-shrink-0 hover:bg-indigo-100">
            Dividir Imagem Carrossel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar; 