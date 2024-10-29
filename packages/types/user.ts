export type SimpleRole = {
  roleName: string;
  value: string;
}

export type UserLoginRes = {
  desc: string;
  realName: string;
  token: string;
  userId: string;
  username: string;
  avatar: string;
  roles: SimpleRole[];
}