import { Header } from './header';

export interface Branch {
  _id: string;
  name: string;
  release?: string;
  hasPassword?: string;
  url: string;
  headers: Header[];
}
