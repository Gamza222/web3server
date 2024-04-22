export interface UsersData {
  created_at: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  code: string;
  verified: boolean;
  verifCode: string;
  verifCode_created_at: string;
}

export interface VerifyUserData {
  userId: string;
  code: string;
}

export interface LoginData {
  email: string;
  code: string;
}

export interface SendLoginCodeData {
  email: string;
  password: string;
}

export const UsersTableName = 'users';

export const createUserSchema = `
  CREATE TABLE IF NOT EXISTS ${UsersTableName} (
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userId VARCHAR(255) UNIQUE NOT NULL,
    name  VARCHAR(255) NOT NULL,
    email  VARCHAR(255) NOT NULL,
    password  VARCHAR(255) NOT NULL,
    code  VARCHAR(255) NOT NULL,
    verified  VARCHAR(255) NOT NULL,
    verifCode  VARCHAR(255) NOT NULL,
    verifCode_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;
