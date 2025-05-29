import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-[160px] z-40 hidden md:block">
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-r-lg p-4 border-r border-t border-b border-indigo-100">
        <h3 className="text-base font-semibold mb-3 text-indigo-800 border-b border-indigo-100 pb-2">
          Ferramentas
        </h3>
        <ul className="space-y-3">
          <li>
            <Link href="/cortar-carrossel-infinito" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Cortar Carrossel Infinito
            </Link>
          </li>
          <li>
            <Link href="/cortar-imagem-carrossel" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Cortar Imagem Carrossel
            </Link>
          </li>
          <li>
            <Link href="/image-splitter-online" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              ImageSplitter Online
            </Link>
          </li>
          <li>
            <Link href="/dividir-imagem-carrossel" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Dividir Imagem Carrossel
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 