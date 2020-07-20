import User from '../models/User'
import File from '../models/File'

class UserController {

  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } })
    if (userExist) {
      return res.status(400).json({ error: 'User already exist' })
    }
    const user = await User.create(req.body)
    return res.json(user)
  }

  async update(req, res) {
    const { email, oldPassword } = req.body
    const user = await User.findByPk(req.userId)

    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } })
      if (userExist) {
        return res.status(400).json({ error: 'User already exist' })
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Old Password does not match' })
    }
    await user.update(req.body)

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    })
    return res.json({ id, name, email, avatar })
  }
}

export default new UserController()