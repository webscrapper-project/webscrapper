import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import {ApiMethodsEnum} from "../enums/api-methods.enum";

export class HttpClient {
  public readonly axiosInstance: AxiosInstance;

  private baseData: any;

  constructor() {
    this.axiosInstance = axios.create();

    this.axiosInstance.interceptors.response.use(
      undefined
    );
  }

  /**
   * Dispatches an HTTP GET request.
   *
   * @param path - Relative path for a request
   * @param params - Query parameters
   * @param config
   */
  get(
    path: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    return this.dispatch(ApiMethodsEnum.GET, path, params, undefined, config);
  }

  protected async dispatch<T>(
    method: ApiMethodsEnum,
    path: string,
    params?: any,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    let response;
    try {
      const requestConfig = {
        ...config,
        method,
        params,
        data,
      };

      response = this.axiosInstance(path, requestConfig);
    } catch (error) {
      if (error.response !== undefined) {
        throw new HttpException(
          {
            message: `Error[${path}]`,
            response: error.response.data,
            method,
            path,
            params,
            data,
          },
          error.response.status,
        );
      } else {
        throw new InternalServerErrorException({
          message: `Error[${path}]:\n${error.message}`,
          method,
          path,
          params,
          data,
        });
      }
    }

    return response;
  }
}
