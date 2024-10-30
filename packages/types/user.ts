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

export type AccountType = {
  account: string;
  createdBy: string;
  createdTime: string; // 可以考虑使用 Date 类型，如果你在处理日期时需要
  dept: string;
  email: string;
  id: string;
  nickname: string;
  pwd: string; // 注意：在生产环境中，不建议明文存储密码
  remark?: string; // 可选属性
  revision: number;
  role: string;
  updatedBy: string;
  updatedTime: string; // 同样可以考虑使用 Date 类型
}