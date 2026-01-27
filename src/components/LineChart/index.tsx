interface LineChartProps {
    value?: number;
    maxValue?: number;
    minValue?: number;
    reverseColor?: boolean;
}

const LineChart = ({ value = 0, maxValue = 100, minValue = 0, reverseColor = false }: LineChartProps) => {
    // Değerin min ve max arasındaki yüzdesini hesapla
    const percentage = Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));
    
    // Yüzdeye göre height değerini hesapla (max 120px)
    const height = Math.floor((percentage / 100) * 120);
    
    // Ortalama değeri hesapla
    const average = (maxValue + minValue) / 2;
    
    // Değere göre renk belirle
    let barColor = "#5EB044"; // Varsayılan yeşil
    
   
    if (reverseColor) {
        if (value < minValue + (maxValue - minValue) * 0.3) {
            // Değer çok düşükse kırmızı
            barColor = "#E84747";
        } else if (value > average && value < average + (maxValue - average) * 0.6) {
            // Değer ortalamanın üstündeyse sarı
            barColor = "#FFD600";
        } else if (value >= average + (maxValue - average) * 0.6) {
            // Değer çok yüksekse kırmızı
            barColor = "#5EB044";
        }
    } else {
        if (value < minValue + (maxValue - minValue) * 0.3) {
            // Değer çok düşükse kırmızı
            barColor = "#5EB044";
        } else if (value > average && value < average + (maxValue - average) * 0.6) {
            // Değer ortalamanın üstündeyse sarı
            barColor = "#FFD600";
        } else if (value >= average + (maxValue - average) * 0.6) {
            // Değer çok yüksekse kırmızı
            barColor = "#E84747";
        }
    }
    
    return (
        <div className="max-w-[35px] h-[110px] bg-gray3 dark:bg-gray9 rounded-[10px] flex flex-col-reverse overflow-hidden mr-2">
        <div
            className="w-[35px]  rounded-[10px]"
            style={{ height: height , backgroundColor: barColor}}
        />
        </div>
    );
};

export default LineChart;
