import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, BarChart, Target, Globe } from 'lucide-react';

const CookieConsentSystem = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Her zaman true (zorunlu)
    analytics: false,
    marketing: false,
    functional: false
  });

  // Sayfa yüklendiğinde çerez durumunu kontrol et
  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setShowBanner(true);
    } else {
      setCookiePreferences(consent.preferences);
      loadScripts(consent.preferences);
    }
  }, []);

  // Çerez onayını localStorage'dan al
  const getCookieConsent = () => {
    try {
      const stored = localStorage.getItem('cookie-consent');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  // Çerez onayını kaydet
  const saveCookieConsent = (preferences) => {
    const consent = {
      preferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
  };

  // Scriptleri yükle (örnek)
  const loadScripts = (preferences) => {
    if (preferences.analytics) {
      // Google Analytics yükle
      console.log('Analytics çerezleri aktif edildi');
      // gtag('config', 'GA_TRACKING_ID');
    }
    
    if (preferences.marketing) {
      // Marketing scriptleri yükle
      console.log('Pazarlama çerezleri aktif edildi');
      // Facebook Pixel, Google Ads vs.
    }
    
    if (preferences.functional) {
      // Functional çerezler
      console.log('İşlevsel çerezler aktiv edildi');
    }
  };

  // Tümünü kabul et
  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setCookiePreferences(allAccepted);
    saveCookieConsent(allAccepted);
    loadScripts(allAccepted);
    setShowBanner(false);
    setShowDetails(false);
  };

  // Tümünü reddet (sadece zorunlu çerezler)
  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setCookiePreferences(onlyNecessary);
    saveCookieConsent(onlyNecessary);
    loadScripts(onlyNecessary);
    setShowBanner(false);
    setShowDetails(false);
  };

  // Özel ayarları kaydet
  const savePreferences = () => {
    saveCookieConsent(cookiePreferences);
    loadScripts(cookiePreferences);
    setShowBanner(false);
    setShowDetails(false);
  };

  // Çerez türü değiştir
  const toggleCookieType = (type) => {
    if (type === 'necessary') return; // Zorunlu çerezler değiştirilemez
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const cookieTypes = [
    {
      key: 'necessary',
      title: 'Zorunlu Çerezler',
      description: 'Web sitesinin çalışması için gerekli olan temel çerezlerdir. Bu çerezler güvenlik, oturum yönetimi gibi temel işlevleri sağlar.',
      icon: <Shield className="w-5 h-5" />,
      required: true
    },
    {
      key: 'analytics',
      title: 'Analitik Çerezler',
      description: 'Web sitesi trafiği ve kullanıcı davranışlarını analiz etmek için kullanılır. Google Analytics gibi servisler bu kategoriye girer.',
      icon: <BarChart className="w-5 h-5" />
    },
    {
      key: 'marketing',
      title: 'Pazarlama Çerezler',
      description: 'Reklam hedefleme ve sosyal medya entegrasyonu için kullanılır. Kullanıcıya özel reklamlar göstermek amacıyla kullanılır.',
      icon: <Target className="w-5 h-5" />
    },
    {
      key: 'functional',
      title: 'İşlevsel Çerezler',
      description: 'Dil tercihi, tema ayarları gibi kullanıcı deneyimini geliştiren özellikler için kullanılır.',
      icon: <Globe className="w-5 h-5" />
    }
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-6xl mx-auto p-6">
          {!showDetails ? (
            // Ana banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Çerezleri kullanıyoruz
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rızanız olmadan yalnızca web sitesinin çalışması için gerekli olan çerezleri kullanırız. 
                  Tümünü kabul et'e tıklarsanız, analiz amacıyla ve sizinle ilgili içeriği görüntülemek için 
                  hedefli çerezleri kullanırız. Size keyifli bir çevrimiçi yolculuk sunmak için, 
                  diğer çerezler pazarlama ve optimizasyon amacıyla ayarlanmıştır.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                <button
                  onClick={acceptAll}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                >
                  Tümünü Kabul Et
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Ayarlar
                </button>
                <button
                  onClick={rejectAll}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                >
                  Tümünü Reddet
                </button>
              </div>
            </div>
          ) : (
            // Detaylı ayarlar
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Çerez Ayarları
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm">
                AB-ABD veri koruma anlaşmasına kaydolmamış ABD şirketlerinden çerezler de kullandığımızı lütfen unutmayın.
              </p>

              <div className="space-y-4 max-h-60 overflow-y-auto">
                {cookieTypes.map((type) => (
                  <div key={type.key} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 min-w-fit">
                      <div className="text-red-600">{type.icon}</div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences[type.key]}
                          onChange={() => toggleCookieType(type.key)}
                          disabled={type.required}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500 disabled:opacity-50"
                        />
                        <span className="font-medium text-gray-900">{type.title}</span>
                        {type.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Zorunlu
                          </span>
                        )}
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 flex-1">{type.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                >
                  Tümünü Kabul Et
                </button>
                <button
                  onClick={savePreferences}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                >
                  Seçimleri Kaydet
                </button>
                <button
                  onClick={rejectAll}
                  className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded hover:bg-gray-400 transition-colors"
                >
                  Tümünü Reddet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" />
      )}
    </>
  );
};
export default CookieConsentSystem;