import AuthController from '#controllers/auth_controller'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class EnsureOwnership {
  public async handle({ auth, request, response }: HttpContext, next: () => Promise<void>) {
    try {
      const authenticatedUser = auth.user
      const resourceId = Number.parseInt(request.param('id'), 10)
      const resource = await User.findOrFail(resourceId)
      if (
        AuthController.ensureOwnership(authenticatedUser, resource.id) ||
        AuthController.ensureAdmin(authenticatedUser)
      ) {
        return await next()
      }
      return response.status(403).json({
        message: 'You are not allowed to access or modify this resource.',
      })
    } catch (error) {
      return response.status(400).json({
        message: 'An error occurred during authorization.',
        error: error.message,
      })
    }
  }
}
