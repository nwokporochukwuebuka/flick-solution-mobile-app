import axios from 'axios';
import CONSTANTS from '../config/config';

export async function bookParkingSpace(id: string, token: string) {
  try {
    const result = await axios.patch(
      `${CONSTANTS.PROD_BASE_URL}/reservation/pay/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return result;
  } catch (error: any) {
    return error.response;
  }
}
