interface Operator {
    name: string;
    location: string;
    phone: string;
    machine: string;
}

const OperatorDetail: React.FC<{ operator: Operator }> = ({ operator }) => {
    return(
        <div className="flex justify-center py-12 px-4">
        <form className="w-full max-w-4xl space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-2xl font-semibold text-gray-900">Operator Profili</h2>
                <p className="mt-1 text-sm text-gray-600">Not: bu kısımda değiştirilebilirliği role göre verebiliriz. Rol durumuna göre form veya metin halinde.</p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-900">Kullanıcı adı</label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-[10px] bg-white pl-3 outline outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                                <div className="shrink-0 text-gray-500"></div>
                                <input type="text" name="username" id="username" className="block min-w-0 grow py-1.5 pl-1 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm" placeholder="kullanıcı adı" />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="about" className="block text-sm font-medium text-gray-900">Hakkında</label>
                        <div className="mt-2">
                            <textarea name="about" id="about"  className="block w-full rounded-[10px] bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm"></textarea>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">Operator hakkında özet bilgi</p>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-900">Fotoğraf</label>
                        <div className="mt-2 flex items-center gap-x-3">
                            <svg className="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                            </svg>
                            <button type="button" className="rounded-[10px] bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Değiştir</button>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-900">Kapak fotoğrafı</label>
                        <div className="mt-2 flex justify-center rounded-[10px] border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                </svg>
                                <div className="mt-4 flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-[10px] bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                        <span>Bir dosya yükle</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">veya sürükleyip bırakın</p>
                                </div>
                                <p className="text-xs text-gray-600">PNG, JPG, GIF 10MB'a kadar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-2xl font-semibold text-gray-900">Kişisel Bilgiler</h2>
                <p className="mt-1 text-sm text-gray-600">Mail alabileceğiniz kalıcı bir adres kullanın.</p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">{operator.name}</label>
                        <div className="mt-2">
                            <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-[10px] bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm" />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">Soyad</label>
                        <div className="mt-2">
                            <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-[10px] bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm" />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">Tel - 1</label>
                        <div className="mt-2">
                            <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-[10px] bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm" />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">Tel - 2</label>
                        <div className="mt-2">
                            <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-[10px] bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm" />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">E-posta</label>
                        <div className="mt-2">
                            <input type="email" name="email" id="email" autoComplete="email" className="block w-full rounded-[10px] bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    );
};
export default OperatorDetail;