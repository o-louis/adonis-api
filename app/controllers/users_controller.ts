import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/user'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.status(200).json({ data: users })
  }
  async show({ request, response }: HttpContext) {
    const user = await User.find(request.param('id'))
    return response.status(200).json({ data: user })
  }
  async update({ request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(updateUserValidator)
      const user = await User.findOrFail(request.param('id'))
      user.merge(validatedData)
      await user.save()

      return response.status(200).json({ message: 'User updated successfully.', data: user })
    } catch (error) {
      response.badRequest({ messages: 'Impossible to update the user', error: error.messages })
    }
  }
  async destroy({ request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(request.param('id'))
      await user.delete()

      return response.status(200).json({ message: 'User deleted successfully.', data: user })
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
