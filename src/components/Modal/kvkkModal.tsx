import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'


import GeneralTitle from '../Title/GeneralTitle';


interface Props {
    isOpen: boolean;
    onClose: () => void; // onClose fonksiyonunu props olarak alıyoruz
}

const KvkkModal = ({ isOpen, onClose }: Props) => {



   


    

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
                style={{
                    opacity: 1 // Opaklık eklemek için opacity'yi ayarlayın
                }}
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-[10px] bg-white shadow-xl transition-all items-center justify-center pt-4"
                        style={{ maxWidth: '700px', maxHeight: '750px', width: '100%', height: '750px' }} // Direkt stil verme
                    >
                        <GeneralTitle title='Kişisel Verilerin Korunması Kanunu Aydınlatma Metni' />
                        <div className='max-h-[500px] bg-gray-100 mx-4 rounded-[10px] mt-4 overflow-y-auto'>
                            <p className='text-gray10 font-bold text-xl font-inter my-2'>AYDINLATMA METNİ BAŞLIK</p>
                            <p className='text-gray10 font-medium text-base font-inter text-left p-4'>
                                Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
                                Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.Bu çok uzun bir metin olacak. İçeriği buraya yerleştirebilirsin. Bu şekilde, metnin
                                fontunu, rengini, satır aralığını ve boyutunu kontrol edebilirsin.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
                            </p>
                        </div>

                        <div className="form-control border-0 items-center cursor-pointer mt-2">
                            <label className="label  flex items-center justify-start space-x-2">
                                <input type="checkbox" defaultChecked className="checkbox w-6 h-6 rounded-[10px] border-2" />
                                <span className="label-text text-sm text-gray-700">Okudum, anladım. Kabul ediyorum.</span>
                            </label>
                        </div>

                       <div className='w-full items-center flex justify-center mt-2'
                       onClick={onClose}
                       >
                       <div className="flex h-10 w-40 items-center self-center justify-center bg-gray4 mr-4 rounded-[10px] cursor-pointer">
                            <span className="text-white font-inter font-bold text-sm">Kabul Ediyorum</span>
                        </div>
                       </div>


                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
};
export default KvkkModal;
