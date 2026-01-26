export const NotificationData = [
  {
    "id": 1,
    "name_en": "Low Vehicle Battery Voltage",
    "name_tr": "Düşük Araç Batarya Voltajı",
    "data_key": ["vehicleBattery"],
    "severity": "CRITICAL"
  },
  {
    "id": 2,
    "name_en": "Upcoming Maintenance",
    "name_tr": "Yaklaşan Bakım",
    "data_key": ["remainingHoursToMaintenance"],
    "severity": "WARNING"
  },
  {
    "id": 3,
    "name_en": "Maintenance time has arrived",
    "name_tr": "Bakım zamanı gelmiştir.",
    "data_key": ["remainingHoursToMaintenance"],
    "severity": "CRITICAL"
  },
  {
    "id": 4,
    "name_en": "Low fuel level",
    "name_tr": "Düşük yakıt seviyesi",
    "data_key": ["FuelLevel"],
    "severity": "MINOR"
  },
  {
    "id": 5,
    "name_en": "Low def level",
    "name_tr": "Düşük def seviyesi",
    "data_key": ["UreaTankLevel"],
    "severity": "MINOR"
  },
  {
    "id": 6,
    "name_en": "Outside of safe zone",
    "name_tr": "Güvenli bölgenin dışında",
    "data_key": ["latitude", "longitude"],
    "severity": "MAJOR"
  },
  {
    "id": 7,
    "name_en": "Engine Error",
    "name_tr": "Motor Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 8,
    "name_en": "Engine Error",
    "name_tr": "Motor Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 9,
    "name_en": "Engine Error",
    "name_tr": "Motor Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 10,
    "name_en": "Engine Error",
    "name_tr": "Motor Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 11,
    "name_en": "Transmission Error",
    "name_tr": "Şanzıman Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 12,
    "name_en": "Transmission Error",
    "name_tr": "Şanzıman Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 13,
    "name_en": "Transmission Error",
    "name_tr": "Şanzıman Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 14,
    "name_en": "Transmission Error",
    "name_tr": "Şanzıman Hatası",
    "data_key": ["src", "spn", "fmi", "hrs", "ts"],
    "severity": "CRITICAL"
  },
  {
    "id": 15,
    "name_en": "Overspeed",
    "name_tr": "Aşırı Hız",
    "data_key": ["speed"],
    "severity": "WARNING"
  },
  {
    "id": 16,
    "name_en": "Geofence Alarm",
    "name_tr": "Coğrafi Sınır Alarmı",
    "data_key": [],
    "severity": "MAJOR"
  },
  {
    "id": 17,
    "name_en": "Low Battery",
    "name_tr": "Düşük Batarya",
    "data_key": [],
    "severity": "MAJOR"
  }
];
