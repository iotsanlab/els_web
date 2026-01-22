// type.ts
export interface ReportData {
  id: number;
  name: string;
  type: string;
  timePeriod: string;
  createdTime: string;
  source: string[];
  formData?: CheckboxItem[]; // Burada formData makineleri temsil ediyor
}

export interface CheckboxItem {
  id: string;
  label: string;
  checked: boolean;
  serialNo?: string;
  model?: string;
  type?: string;
  children?: CheckboxItem[];
}
