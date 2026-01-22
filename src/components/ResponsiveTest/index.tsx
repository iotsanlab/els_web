import { useEffect, useState } from 'react'; 

const ResponsiveTest = () => {
  // Ekran çözünürlüğünü almak için
  const getScreenResolution = () => {
    if (typeof window !== 'undefined') {
      return `${window.innerWidth}x${window.innerHeight}`;
    }
    return '';
  };

  // All hooks at the top before any conditionals
  const [resolution, setResolution] = useState(
    typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : ''
  );
  
  useEffect(() => {
    const handleResize = () => {
      setResolution(getScreenResolution());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Conditional return after all hooks
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-0 z-50 left-0 flex items-center justify-center px-2 py-1  bg-red-500 rounded-[10px] 4xl:bg-red-500 3xl:bg-blue-500 2xl:bg-green-500 1.5xl:bg-teal-500 xl:bg-orange-500 lg:bg-yellow-500 md:bg-purple-500 sm:bg-black">
      <p className="hidden text-white 4xl:flex 3xl:hidden 2xl:hidden xl:hidden lg:hidden md:hidden sm:hidden">
        4xl <span className="ml-1">({resolution})</span>
      </p>
      <p className="hidden text-white 4xl:hidden 3xl:flex 2xl:hidden xl:hidden lg:hidden md:hidden sm:hidden">
        3xl <span className="ml-1">({resolution})</span>
      </p>
      <p className="hidden text-white 4xl:hidden 3xl:hidden 2xl:flex xl:hidden lg:hidden md:hidden sm:hidden">
        2xl <span className="ml-1">({resolution})</span>
      </p>
      <p className="hidden text-white 4xl:hidden 3xl:hidden 2xl:hidden xl:hidden 1.5xl:flex lg:hidden md:hidden sm:hidden">
        1.5xl <span className="ml-1">({resolution})</span>
      </p>
      <p className="hidden text-white 4xl:hidden 3xl:hidden 2xl:hidden xl:flex lg:hidden md:hidden sm:hidden">
        xl <span className="ml-1">({resolution})</span>
      </p>
      <p className="hidden text-white 4xl:hidden 3xl:hidden 2xl:hidden xl:hidden lg:flex md:hidden sm:hidden">
        lg <span className="ml-1">({resolution})</span>
      </p>
      <p className="hidden text-white 4xl:hidden 3xl:hidden 2xl:hidden xl:hidden lg:hidden md:flex sm:hidden">
        md <span className="ml-1">({resolution})</span>
      </p>
      <p className="hidden text-white 4xl:hidden 3xl:hidden 2xl:hidden xl:hidden lg:hidden md:hidden sm:flex">
        sm <span className="ml-1">({resolution})</span>
      </p>
    </div>
  );
};

export default ResponsiveTest;
