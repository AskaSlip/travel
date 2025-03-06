import * as bcrypt from 'bcrypt';

export class RandomPasswordHelper {
  public static generateRandomPassword(): string {

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialChars = '@$!%_*#?&';

    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomDigit = digits.charAt(Math.floor(Math.random() * digits.length));
    const randomSpecialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    const remainingLength = 10;
    const allChars = letters + digits + specialChars;
    let randomRest = '';
    for (let i = 0; i < remainingLength; i++) {
      randomRest += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    const passwordArray = [randomLetter, randomDigit, randomSpecialChar, ...randomRest.split('')];
    passwordArray.sort(() => Math.random() - 0.5);

    return passwordArray.join('');
  }
}


