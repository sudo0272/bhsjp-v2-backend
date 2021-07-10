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

  private async generateSaltAndPassword(password: string): Promise<string[]> {
    const salt = await this.generateSalt()
    const hashedPassword = await this.hash(password, salt)

    return [salt, hashedPassword]
  }

  public async createUser(username: string, nickname: string, password: string, email: string): Promise<void> {
    const [salt, hashedPassword] = await this.generateSaltAndPassword(password)

    try {
      await this.mysqlManager.query(
        "INSERT" +
        "  INTO `Account`" +
        "  (`username`, `nickname`, `password`, `salt`, `email`, `level`)" +
        "  VALUES (?, ?, ?, ?, ?, ?)",
        [username, nickname, hashedPassword, salt, email, 1]
      )
    } catch (e) {
      throw e
    }
  }

  public async updateNickname(id: number, nickname: string): Promise<void> {
    try {
      await this.mysqlManager.query(
        "UPDATE `Account`" +
        "  SET `nickname` = ?" +
        "  WHERE `id` = ?",
        [nickname, id]
      )
    } catch (e) {
      throw e
    }
  }

  public async updatePassword(id: number, password: string) {
    const [salt, hashedPassword] = await this.generateSaltAndPassword(password)

    try {
      await this.mysqlManager.query(
        "UPDATE `Account`" +
        "  SET `password` = ?, `salt` = ?" +
        "  WHERE `id` = ?",
        [hashedPassword, salt, id]
      )
    } catch (e) {
      throw e
    }
  }

  public async updateEmail(id: number, email: string) {
    try {
      await this.mysqlManager.query(
        "UPDATE `Account`" +
        "  SET `email` = ?" +
        "  WHERE `id` = ?",
        [email, id]
      )
    } catch (e) {
      throw e
    }
  }

  public async increaseLevel(id: number) {
    try {
      await this.mysqlManager.query(
        "UPDATE `Account`" +
        "  SET `level` = `level` + 1" +
        "  WHERE `id` = ?",
        [id]
      )
    } catch (e) {
      throw e
    }
  }

  public async decreaseLevel(id: number) {
    try {
      await this.mysqlManager.query(
        "UPDATE `Account`" +
        "  SET `level` = `level` - 1" +
        "  WHERE `id` = ?",
        [id]
      )
    } catch (e) {
      throw e
    }
  }
}

export default Account

