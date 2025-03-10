export interface IResetPassword {
    resetToken: string;
    password: string;
    password_repeat?: string;
}