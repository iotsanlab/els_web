import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';


interface Slide {
  image: string;
  text: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
}

const InfoModal: React.FC<ModalProps> = ({ isOpen, onClose, slides }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Klavye desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Body scroll kilit
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full relative shadow-2xl transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">


          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {currentIndex + 1} / {slides.length}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white transition-colors duration-200 group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-red-500  duration-200" />
          </button>
        </div>

        {/* Ana İçerik */}
        <div className="relative overflow-hidden">
          {/* Resim Alanı */}
          <div className="relative h-80 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <img
              src={slides[currentIndex].image}
              alt={`Slayt ${currentIndex + 1}`}
              className={`w-full h-full object-contain transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
            />

            {/* Navigasyon Butonları */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={isAnimating}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={isAnimating}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* Metin Alanı */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <p className={`text-center text-gray-700 dark:text-gray-300 leading-relaxed transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
              {slides[currentIndex].text}
            </p>
          </div>
        </div>

        {/* Alt Navigasyon */}
        {slides.length > 1 && (
          <div className="p-6 border-t  dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {/* Nokta İndikatörleri */}
            <div className="flex justify-center gap-2 mb-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-[2px] h-[2px] rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-mstYellow scale-110'
                      : 'bg-gray-300 dark:bg-gray-600 '
                    }`}
                />
              ))}
            </div>

            {/* Kontrol Butonları */}
            <div className="flex justify-center gap-3">
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow">
                <ChevronLeft className="w-4 h-4" />
                {t("global.back")}
              </button>

              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="flex items-center gap-2 px-4 py-2 bg-mstYellow text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow">
                {t("global.next")}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal;