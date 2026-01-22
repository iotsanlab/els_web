import * as ApiUrl from '../endpoints.ts';
import * as HttpClient from '../http-client.ts';
import { userStore } from "../../store/UserStore.ts";
import { IResponseTimeSeries } from "../../models/timeseries.ts";
import { IResponseAttributes } from "../../models/attributes.ts";



const token = userStore.token;



export const getValuesAttributes = async (entityType: string, entityId: string, keys: string[], startTs?: number, endTs?: number): Promise<IResponseAttributes[]> => {
  const keysQuery = keys.join('%2C');
  let url = `${ApiUrl.telemetry}/${entityType}/${entityId}/values/attributes?keys=${keysQuery}`;

  if (startTs && endTs) {
    url += `&startTs=${startTs}&endTs=${endTs}`;
  }



  const response = await HttpClient.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};


export const getValuesTimeSeries = async (entityType: string, entityId: string, keys: string[], startTs?: number, endTs?: number, daily?: boolean,  monthly?: boolean): Promise<IResponseTimeSeries[]> => {
  const keysQuery = keys.join(',');
  let url = `${ApiUrl.telemetry}/${entityType}/${entityId}/values/timeseries?keys=${keysQuery}`;

  if (startTs) {
    if (!endTs) {
      endTs = new Date(startTs).setHours(23, 59, 59, 999);
    }
    url += `&startTs=${startTs}&endTs=${endTs}`;
  }

  // burada günlük verinin gelmesini sağlayan parametre eklendi.
  if (daily){
    url += `&agg=MAX&interval=86400000`;
  }

  if (monthly){
    url += `&agg=MAX&interval=2592000000`; // ~30 gün (30 * 24 * 60 * 60 * 1000 ms)
  }

//  console.log(url, 'url giden')

  const response = await HttpClient.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });


  return response.data;
};





export const setValuesTimeSeries = async (deviceId: any, scope: string, data: any): Promise<IResponseAttributes[]> => {
  let url = `${ApiUrl.telemetry}/${deviceId}/${scope}`;

  //console.log(url, 'url giden');

  const response = await HttpClient.post(url, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};



export const submitOperatorInfo = async (entity_type: string, exc_id: string, opName: string, opPhone: string): 
Promise<IResponseAttributes[]> => {
  const requestBody = {
    opName: opName,
    opPhone: opPhone
  };

  const url = `${ApiUrl.telemetry}/${entity_type}/${exc_id}/attributes/SHARED_SCOPE`;

  //console.log(url, 'URL being used');

  const response = await HttpClient.post(url, requestBody, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const submitDeviceName = async (entity_type: string, exc_id: string, deviceName: string): 
Promise<IResponseAttributes[]> => {
  const requestBody = {
    deviceName: deviceName
  };

  const url = `${ApiUrl.telemetry}/${entity_type}/${exc_id}/attributes/SHARED_SCOPE`;

  //console.log(url, 'URL being used');

  const response = await HttpClient.post(url, requestBody, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};







export const getDeviceAttributes = async (deviceIds: string[], keys: string[]): Promise<any[]> => {
  // API URL'si
  const url = `https://makinanerede.com:8080/api/plugins/telemetry/ASSET/${deviceIds[0]}/values/attributes?keys=${keys.join(',')}`;


  try {
      // API'ye POST isteği gönderiyoruz
      const response = await HttpClient.get(url, {
          headers: {
              'Authorization': `Bearer ${token}`, // token'ı doğru şekilde eklemeyi unutma
          }
      });

      // API yanıtını döndür
      return response.data;
  } catch (error) {
      console.error("Error fetching device attributes:", error);
      throw new Error("Failed to fetch device attributes");
  }
};

export const getUserInfos = async (): Promise<any> => {
  const url = `https://makinanerede.com:8080/api/auth/user`;

  try {
    const response = await HttpClient.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("getUserInfo API hatası:", error);
    throw new Error("Kullanıcı bilgisi alınamadı.");
  }
};

