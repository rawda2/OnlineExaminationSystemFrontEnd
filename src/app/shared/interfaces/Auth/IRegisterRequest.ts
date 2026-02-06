export interface IRegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
  branchId: number;
  trackId: number;
}
