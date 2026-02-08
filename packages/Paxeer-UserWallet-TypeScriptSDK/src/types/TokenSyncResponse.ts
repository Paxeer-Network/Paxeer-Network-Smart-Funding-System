export interface TokenSyncResponse {
  success?: boolean;
  total?: number;
  complete?: number;
  partial?: number;
  missing?: number;
  with_icon?: number;
}
