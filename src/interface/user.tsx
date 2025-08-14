export default interface Student {
    id: any;
    success: any;
    _id?: string;
    name: string;
    email?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
    is_verified?: boolean;
    createdAt?: string;
  }

  export interface Login {
    email: string;
    password: string;
}