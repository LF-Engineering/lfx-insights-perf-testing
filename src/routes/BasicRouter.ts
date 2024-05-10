import path from 'path';
import { readFileSync } from 'fs';

export class BasicRouter {
  protected getSqlSync(sqlName: string): string {
    const sqlFilePath = path.join(__dirname, `../sql/${sqlName}.sql`);
    return readFileSync(sqlFilePath, 'utf8');
  }
}
