export type Meta = {
  icon: string;
  title: string;
  hideMenu?: boolean;
  ignoreKeepAlive?: boolean;
}

export type Route = {
  path: string;
  name: string;
  icon: string;
  component: string;
  id: string;
  meta: Meta;
  orderNo: number;
  parentPath: string;
  children?: Route[]; 
}
