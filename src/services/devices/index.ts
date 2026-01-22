import * as ApiUrl from '../endpoints.ts';
import * as HttpClient from '../http-client.ts';
import { userStore } from "../../store/UserStore.ts";
import { IResponseDevices } from "../../models/devices.ts"


const token = userStore.token;

export const getDevices = async (page: number = 0, pageSize: number = 200): Promise<IResponseDevices> => {

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await HttpClient.get(ApiUrl.devices+`?pageSize=${pageSize}&page=${page}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
  );
  return response.data;
};


