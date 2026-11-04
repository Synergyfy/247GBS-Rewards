import dataSource from './data-source.js';
import { User } from '../modules/user/entities/user.entity.js';
import { Role } from '../core/enums/roles.js';
import { SignupSource } from '../core/enums/signupSource.js';
import { hashPassword } from '../bcypt/bcrypt.js';

/**
 * Creates (or promotes) a super-admin account so the dashboard has a login.
 *
 * Usage:
 *   SUPER_ADMIN_EMAIL=super@example.com \
 *   SUPER_ADMIN_PASSWORD='change-me' \
 *   SUPER_ADMIN_NAME='Super Admin' \
 *   SUPER_ADMIN_PHONE='+1 555 0100' \
 *   pnpm --filter mcom_backend seed:super-admin
 */
async function main(): Promise<void> {
  const email = process.env.SUPER_ADMIN_EMAIL ?? 'super@247gbs.test';
  const password = process.env.SUPER_ADMIN_PASSWORD ?? 'password';
  const fullName = process.env.SUPER_ADMIN_NAME ?? 'Super Admin';
  const phoneNumber = process.env.SUPER_ADMIN_PHONE ?? '+1 555 0100';

  await dataSource.initialize();
  const repository = dataSource.getRepository(User);

  const existing = await repository.findOne({ where: { email } });
  if (existing) {
    existing.role = Role.SUPER_ADMIN;
    existing.isActive = true;
    existing.password = await hashPassword(password);
    await repository.save(existing);
    console.log(`Promoted existing account ${email} to super_admin.`);
  } else {
    const user = repository.create({
      fullName,
      email,
      phoneNumber,
      password: await hashPassword(password),
      role: Role.SUPER_ADMIN,
      signupSource: SignupSource.MCOM,
      isActive: true,
    });
    await repository.save(user);
    console.log(`Created super_admin account ${email}.`);
  }

  await dataSource.destroy();
}

main().catch(async (error) => {
  console.error('Could not seed the super-admin account:', error);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exitCode = 1;
});
