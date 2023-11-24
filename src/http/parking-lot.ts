import axios from 'axios';
import CONSTANTS from '../config/config';

export async function getAvailableParkingSpaces(token: any) {
  try {
    const result = await axios.get(
      `${CONSTANTS.PROD_BASE_URL}/parking-lot?isBooked=false`,
      {headers: {Authorization: `Bearer ${token}`}},
    );
    console.log(result.data);
    return result.data.results;
  } catch (error: any) {
    return error.response;
  }
}
