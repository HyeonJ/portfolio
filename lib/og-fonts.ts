import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function batangFonts() {
  const dir = join(process.cwd(), 'assets', 'fonts');
  const [regular, bold] = await Promise.all([
    readFile(join(dir, 'GowunBatang-Regular.ttf')),
    readFile(join(dir, 'GowunBatang-Bold.ttf')),
  ]);
  return [
    { name: 'GowunBatang', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'GowunBatang', data: bold, weight: 700 as const, style: 'normal' as const },
  ];
}
