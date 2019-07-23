export interface optsInterface {
  type: string;
  params?: string[];
  isIterable?: boolean;
  headers?: object;
  defaultType?: string;
  iterable?: string[];
}

export interface typeDefInterface {
  type: string;
  params: string[];
  headers: object;
  isIterable: boolean;
  defaultType: string;
  iterable: string[];
}
