import * as ApiUrl from "../endpoints.ts";
import * as HttpClient from "../http-client.ts";
import { userStore } from "../../store/UserStore.ts";
import { AlarmResponse } from "../../models/alarms.ts";

const token = userStore.token;



export enum Severity {
  CRITICAL = "CRITICAL",
  INDETERMINATE = "INDETERMINATE",
  MAJOR = "MAJOR",
  MINOR = "MINOR",
  WARNING = "WARNING",
}

export const getAlarms = async (page: number = 0, pageSize: number = 10, entity_type?: string, exc_id?: string, ack?: string): Promise<AlarmResponse> => {
  let url = `${ApiUrl.newAlarms}/${entity_type}/${exc_id}?pageSize=${pageSize}&searchStatus=${ack}&sortOrder=DESC&page=${page}&sortProperty=createdTime`;

  const response = await HttpClient.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const tickKnowledge = async (alarmID: string): Promise<{}> => {
  const token = userStore.token;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const response = await HttpClient.post(`${ApiUrl.newAlarms}/${alarmID}/ack`, { headers });

  return response.data;
};

export const getAllAlarms = async (
  page: number = 0, 
  pageSize: number = 10, 
  last3: boolean = false
): Promise<AlarmResponse> => {
  // Backend filtreleme desteklemiyor, tüm veriyi çek
  let url = `${ApiUrl.alarms}?page=${page}&pageSize=${pageSize}&sortOrder=DESC&sortProperty=createdTime${last3 == true ? "&statusList=ACTIVE" : ""}`;

  const response = await HttpClient.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllActiveAlarms = async (page: number = 0, pageSize: number = 3): Promise<AlarmResponse> => {
  let url = `${ApiUrl.alarms}?page=${page}&pageSize=${pageSize}&sortOrder=DESC&sortProperty=createdTime&statusList=ACTIVE`;

  const response = await HttpClient.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

// Tek bir asset için alarm ayarı kaydetme
export const updateAssetAlarmSettings = async (
  assetId: string,
  alarmSetting: Record<string, boolean>
) => {
  try {
    const response = await HttpClient.post(
      `/plugins/telemetry/ASSET/${assetId}/attributes/SERVER_SCOPE`,
      { alarmSetting },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Tek bir asset için alarm ayarlarını getirme
export const getAssetAlarmSettings = async (assetId: string) => {
  try {
    const response = await HttpClient.get(
      `/plugins/telemetry/ASSET/${assetId}/values/attributes?keys=alarmSetting`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const responseData = response.data;
    
    if (Array.isArray(responseData)) {
      const alarmSettingItem = responseData.find(item => item.key === 'alarmSetting');
      return alarmSettingItem?.value || {};
    }

    return responseData || {};
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const ackKnowledgeAlarm = async (alarmID: string) => {
  const response = await HttpClient.post(`${ApiUrl.newAlarms}/${alarmID}/ack`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
