// src/types/User.ts

export interface User {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  number: string;
  user: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
