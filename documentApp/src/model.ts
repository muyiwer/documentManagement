export interface APIResponse {
  responseCode: string;
  responseMessage: string;
  error: string
  data: any;
}

export interface LoginResponse {
  username: string;
  userRole: UserRole;
  accessToken: string;
}

export interface UserRole {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  permissionType: string;
}
