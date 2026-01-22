
import excImage from '../../assets/images/exc.png'; // Excavator resmi buradan alınacak

// Makineler
const makineler = [
  {
    ad: 'Excavator-1',
    şehir: 'İstanbul',
    rol: 'Excavator',
    resimUrl: excImage, // Excavator resmi
    sonGörüntülenme: '2 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T13:23Z',
    işBölümü: 'Excavator',
  },
  {
    ad: 'Forklift-1',
    şehir: 'Ankara',
    rol: 'Forklift',
    resimUrl: excImage, // Forklift resmi
    sonGörüntülenme: '1 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T14:23Z',
    işBölümü: 'Forklift',
  },
  {
    ad: 'Excavator-2',
    şehir: 'İzmir',
    rol: 'Excavator',
    resimUrl: excImage, // Excavator resmi
    sonGörüntülenme: null,
    işBölümü: 'Excavator',
  },
  {
    ad: 'Forklift-2',
    şehir: 'Bursa',
    rol: 'Forklift',
    resimUrl: excImage, // Forklift resmi
    sonGörüntülenme: '4 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T11:23Z',
    işBölümü: 'Forklift',
  },
  {
    ad: 'Excavator-3',
    şehir: 'Antalya',
    rol: 'Excavator',
    resimUrl: excImage, // Excavator resmi
    sonGörüntülenme: '5 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T10:23Z',
    işBölümü: 'Excavator',
  },
  {
    ad: 'Forklift-3',
    şehir: 'Adana',
    rol: 'Forklift',
    resimUrl: excImage, // Forklift resmi
    sonGörüntülenme: null,
    işBölümü: 'Forklift',
  },
];

const HomeVehicles = () => {
  return (
    <div className='flex flex-col h-[500px] overflow-y-auto m-[10px] shadow-lg p-[10px] rounded-[10px] pt-0'>
      {/* Başlık kısmı */}
      <div className="sticky top-0 bg-white z-10 border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900">Makine Listesi</h2>
      </div>
      
      <ul role="list" className="divide-y divide-gray-100">
        {makineler.map((makine) => (
          <li key={makine.ad} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4 w-80"> {/* Genişlik ayarı burada */}
              <img
                alt=""
                src={makine.resimUrl}
                className="w-16 h-16 flex-none rounded-full bg-gray-50" // Profil resmi büyüklüğü
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">{makine.ad}</p>
                <p className="mt-1 truncate text-xs text-gray-500">{makine.şehir}</p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm text-gray-900">{makine.rol}</p>
              <p className="text-xs text-gray-500">{makine.işBölümü}</p> {/* İş bölümü ekleme */}
              {makine.sonGörüntülenme ? (
                <p className="mt-1 text-xs text-gray-500">
                  Son Görüntülenme: <time dateTime={makine.sonGörüntülenmeTarihi}>{makine.sonGörüntülenme}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-gray-500">Çevrimdışı</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeVehicles;
