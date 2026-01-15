export interface ILoginResponse {
  userId: number;
  fullName: string;
  roleName: 'Student' | 'Instructor' | 'Admin' | string;
  branchId: number;
  trackId: number;
  token: string;
}
