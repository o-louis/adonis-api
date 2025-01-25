import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    email: vine.string().trim(),
    password: vine.string().trim().minLength(4).optional(),
  })
)
