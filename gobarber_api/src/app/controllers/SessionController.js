import jwt from 'jsonwebtoken'

import User from '../models/User'
import File from '../models/File'

import Auth from '../../config/auth'

class SessionController {

  async store(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    })
    console.log(user)

    if (!user) {
      return res.status(401).json({ error: 'User not Found' })
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' })
    }

    const { id, name, provider, avatar } = user
    console.log(user)
    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider
      },
      token: jwt.sign({ id }, Auth.secret, { expiresIn: Auth.expiresIn })
    })
  }
}

export default new SessionController()