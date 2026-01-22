
import profileImage from '../../assets/images/profile.png'; // Profil resmi olarak buradan alınacak

// Operatörler
const operatörler = [
  {
    ad: 'Mehmet Yılmaz',
    email: 'mehmet.yilmaz@example.com',
    rol: 'Excavator',
    resimUrl: profileImage, // Profil resmi değiştirildi
    sonGörüntülenme: '3 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T13:23Z',
    işBölümü: 'Excavator',
  },
  {
    ad: 'Ali Can',
    email: 'ali.can@example.com',
    rol: 'Forklift',
    resimUrl: profileImage, // Profil resmi değiştirildi
    sonGörüntülenme: '3 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T13:23Z',
    işBölümü: 'Forklift',
  },
  {
    ad: 'Hasan Demir',
    email: 'hasan.demir@example.com',
    rol: 'Forklift',
    resimUrl: profileImage, // Profil resmi değiştirildi
    sonGörüntülenme: null,
    işBölümü: 'Forklift',
  },
  {
    ad: 'Ayşe Güler',
    email: 'ayse.guler@example.com',
    rol: 'Excavator',
    resimUrl: profileImage, // Profil resmi değiştirildi
    sonGörüntülenme: '3 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T13:23Z',
    işBölümü: 'Excavator',
  },
  {
    ad: 'Elif Akdeniz',
    email: 'elif.akdeniz@example.com',
    rol: 'Excavator',
    resimUrl: profileImage, // Profil resmi değiştirildi
    sonGörüntülenme: '3 saat önce',
    sonGörüntülenmeTarihi: '2023-01-23T13:23Z',
    işBölümü: 'Excavator',
  },
  {
    ad: 'Hakan Yüce',
    email: 'hakan.yuce@example.com',
    rol: 'Forklift',
    resimUrl: profileImage, // Profil resmi değiştirildi
    sonGörüntülenme: null,
    işBölümü: 'Forklift',
  },
];

const HomeOperators = () => {
  return (
    <div className='flex flex-col h-[500px] overflow-y-auto m-[10px] shadow-lg p-[10px] rounded-[10px] pt-0'>
      {/* Başlık kısmı */}
      <div className="sticky top-0 bg-white z-10 border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900">Operatör Listesi</h2>
      </div>
      
      <ul role="list" className="divide-y divide-gray-100">
        {operatörler.map((operatör) => (
          <li key={operatör.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4 w-80"> {/* Genişlik ayarı burada */}
              <img
                alt=""
                src={operatör.resimUrl}
                className="w-16 h-16 flex-none rounded-full bg-gray-50" // Profil resmi büyüklüğü
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">{operatör.ad}</p>
                <p className="mt-1 truncate text-xs text-gray-500">{operatör.email}</p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm text-gray-900">{operatör.rol}</p>
              <p className="text-xs text-gray-500">{operatör.işBölümü}</p> {/* İş bölümü ekleme */}
              {operatör.sonGörüntülenme ? (
                <p className="mt-1 text-xs text-gray-500">
                  Son Görüntülenme: <time dateTime={operatör.sonGörüntülenmeTarihi}>{operatör.sonGörüntülenme}</time>
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

export default HomeOperators;
