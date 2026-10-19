import type { Prisma } from '@prisma/client';
/** Background personalization is allowed for ordinary users, including study
 * participants who explicitly switched to ordinary mode. Default legacy study
 * records remain excluded until a version is selected. */
export const ordinaryUsers: Prisma.UserWhereInput = { OR: [
  { research: { is: null } },
  { research: { is: { withdrawnAt: { not: null } } } },
  { research: { is: { data: { path: ['selectedVersion'], equals: 'normal' } } } },
] };
