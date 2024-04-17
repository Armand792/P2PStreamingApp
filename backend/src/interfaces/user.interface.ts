export interface IRegistrationRequest {
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IGetDashboardInformation {
  user_id: string;
}

export interface IResponse {
  code: number;
  message: string;
  data?: any;
}
