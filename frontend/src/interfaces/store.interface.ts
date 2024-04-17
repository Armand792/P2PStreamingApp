export interface IUserState {
  auth: {
    token: string;
    user_id: string;
  };
}

export interface IUserLogin {
  token: string;
  user_id: string;
}
