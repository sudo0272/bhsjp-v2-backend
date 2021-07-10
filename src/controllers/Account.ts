import MysqlManager from './MysqlManager'
import {
  genSalt,
  hash as hashPassword
} from 'bcrypt'
import {
  promisify
} from 'util'
class Account {
  private mysqlManager: MysqlManager
  private generateSalt: () => Promise<string>
  private hash: (password: string, salt: string) => Promise<string>

  constructor() {
    this.mysqlManager = new MysqlManager()
    this.generateSalt = promisify<string>(genSalt)
    this.hash = promisify<string, string, string>(hashPassword)
  }

  public async createUser(username: string, nickname: string, password: string, email: string): Promise<void> {
    return new Promise(async (resolve) => {
      const salt = await this.generateSalt()
      const hashedPassword = await this.hash(password, salt)

      await this.mysqlManager.query(
        "insert into `Account` (`username`, `nickname`, `password`, `salt`, `email`, `level`) values (?, ?, ?, ?, ?, ?)",
        [username, nickname, hashedPassword, salt, email, 1]
      )
      setTimeout(async () => {
        resolve()
      }, 2000)
    })
  }
}

export default Account

