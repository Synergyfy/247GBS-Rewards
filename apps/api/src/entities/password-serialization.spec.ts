import { instanceToPlain } from 'class-transformer';
import { User } from '../modules/user/entities/user.entity.js';
import { Staff } from '../modules/staff/entities/staff.entity.js';
import { Customer } from '../modules/customer/entities/customer.entity.js';

describe('password hashes are never serialized', () => {
  it.each([
    ['User', User],
    ['Staff', Staff],
    ['Customer', Customer],
  ])('%s omits password but keeps it on the instance', (_name, EntityClass) => {
    const entity = Object.assign(new (EntityClass as any)(), {
      email: 'a@b.com',
      password: '$2b$10$hash',
    });
    expect(instanceToPlain(entity)).toEqual({ email: 'a@b.com' });
    expect(entity.password).toBe('$2b$10$hash'); // login still compares against it
  });
});
