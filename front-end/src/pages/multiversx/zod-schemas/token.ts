import z from 'zod';

export const TokenSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'must be at least 3 charactes long'
    })
    .max(20, {
      message: 'must be at most 20 charactes long'
    }),
  ticker: z
    .string()
    .min(3, {
      message: 'must be at least 3 charactes long'
    })
    .max(10, {
      message: 'must be at most 10 charactes long'
    })
    .refine((value) => {
      if (!/^[A-Z]+$/.test(value)) {
        return false;
      }

      return value;
    }, 'must be uppercase'),
  mintAmount: z.string().min(1, 'required'),
  decimals: z.string().refine((value) => {
    const number = Number.parseInt(value);

    if (Number.isNaN(number) || number < 0 || number > 18) {
      return false;
    }

    return value;
  }, 'must be between 0 and 18'),
  canFreeze: z.boolean(),
  canWipe: z.boolean(),
  canPause: z.boolean(),
  canChangeOwner: z.boolean(),
  canUpgrade: z.boolean(),
  canAddSpecialRoles: z.boolean()
});

export type STTokenSchema = z.infer<typeof TokenSchema>;
