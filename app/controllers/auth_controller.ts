import User, { UserRole } from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import type { HttpContext } from '@adonisjs/core/http'

type TAuthenticateUser =
  | (User & {
      currentAccessToken: AccessToken
    })
  | undefined

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    await user.save()
    return User.accessTokens.create(user)
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    return User.accessTokens.create(user)
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    await auth.check()

    return {
      user: auth.user,
    }
  }

  static ensureOwnership(authenticatedUser: TAuthenticateUser, resourceOwnerId: number): boolean {
    return authenticatedUser?.id === resourceOwnerId
  }

  static ensureAdmin(authenticatedUser: TAuthenticateUser): boolean {
    return authenticatedUser?.role === UserRole.ADMIN
  }
}
