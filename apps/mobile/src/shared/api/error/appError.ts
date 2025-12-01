import { ApiCode } from './apiCode';

export interface AppError {
  code: ApiCode;
  message: string;
  status?: number;
  causeText?: string;
  meta?: Record<string, unknown>;
}
