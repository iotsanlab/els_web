/* 
import ApexCharts from 'react-apexcharts';

const PieChart = () => {
    const options = {
        dataLabels: {
            enabled: false  // dilimlerin içindeki veriyi gizledik
        },
        chart: {
            type: 'donut' as const, // Donut tipi olarak belirledik. Bu sabit değeri kullanalım
            width: '100%', // Grafik genişliği
        },

        labels: ['Kapalı', 'Rölanti', 'Eco', 'Standart', 'Power', 'Power +'], // Etiketler
        colors: ['#D9D9D9', '#4F4F4F', '#5EB044', '#FFD335', '#E84747', '#0A8AD8'], // Renkler

        plotOptions: {
            pie: {
                donut: {
                    size: '60%', // Donut boyutu
                    labels: {
                        show: true,
                        name: {
                            show: false, // Ortadaki ismi göster
                            fontSize: '18px', // Yazı boyutu
                            fontFamily: 'Inter, sans-serif', // Font
                            fontWeight: 'bold', // Font kalınlığı
                        },
                        value: {
                            show: true, // Ortada değeri göster
                            fontSize: '12px', // Yazı boyutu
                            fontFamily: 'Inter, sans-serif',
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total', // Ortadaki metin
                            fontSize: '4px', // Yazı boyutu
                            fontWeight: 'bold',
                            formatter: function (w: any) { // 'w' parametresinin türünü any olarak belirliyoruz
                                const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return `${sum}`;
                            }
                        },
                    },
                },
            },
        },

        // Etiketler için alt alta sıralama ve yanına string veri eklemek
        legend: {
            position: 'bottom', // Etiketleri alt kısma taşır
            horizontalAlign: 'center', // Etiketleri ortalar
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            itemMargin: {
                horizontal: 1, // Etiketler arası yatay mesafe
                vertical: 5, // Etiketler arası dikey mesafe
            },
            // layout: 'vertical', // 'layout' özelliğini kaldırdık, çünkü ApexCharts bunu desteklemiyor.
            formatter: function (seriesName: string, opts: any) {
                const seriesValue = opts.w.globals.series[opts.seriesIndex]; // Her serinin değeri
                return `
                    <div style="font-size: 12px; display: flex; justify-content: space-between; width: 90%; text-align: center; gap: 0px;">
                        <span style="font-weight: bold; color: #333; min-width: 70px; text-align: left; padding-left: 5px; ">${seriesName}</span>
                        <span style="color: ${opts.w.globals.colors[opts.seriesIndex]}; font-size: 14px; min-width: 40px;">${seriesValue} %</span>
                        <span style="color: #888; font-size: 12px; min-width: 120px;">12 saat 1 dk</span>
                    </div>
                `;
            }
        },
    };

    const series = [45, 20, 10, 10, 10, 5]; // Veri

    return (
        <div className="flex justify-center items-center p-6 bg-transparent w-full h-[350px]">
            <ApexCharts options={options} series={series} type="donut" height={350} />
        </div>
    );
};

export default PieChart;
*/