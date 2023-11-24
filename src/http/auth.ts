import axios from 'axios';
import CONSTANTS from '../config/config';

export async function register(
  name: string,
  email: string,
  password: string,
  admin?: boolean,
) {
  try {
    const result = await axios.post(
      `${CONSTANTS.PROD_BASE_URL}/auth/register`,
      {
        name,
        email,
        password,
        role: admin ? 'admin' : 'user',
      },
    );
    return result;
  } catch (error: any) {
    return error.response;
  }
}

export async function login(email: string, password: string) {
  try {
    const result = await axios.post(`${CONSTANTS.PROD_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return result;
  } catch (error: any) {
    return error.response;
  }
}

export async function loginDevice(deviceId: string, passcode: string) {
  try {
    const result = await axios.post(
      `${CONSTANTS.PROD_BASE_URL}/auth/login-device`,
      {deviceId, passcode},
    );
    return result;
  } catch (error: any) {
    return error.response;
  }
}
export async function registerDevice(
  deviceId: string,
  passcode: string,
  email: string,
) {
  try {
    const result = await axios.post(
      `${CONSTANTS.PROD_BASE_URL}/auth/register-device`,
      {email, deviceId, passcode},
    );
    return result;
  } catch (error: any) {
    return error.response;
  }
}
