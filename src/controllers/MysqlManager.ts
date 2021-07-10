import {
  createConnection,
  Connection,
  ConnectionConfig
} from 'mysql'
import {
  readFileSync
} from 'fs'

class MysqlManager {
  private connection: Connection

  constructor() {
    const connectionData: ConnectionConfig = JSON.parse(readFileSync('../models/mysql-connection-data.json', 'utf8'))

    this.connection = createConnection(connectionData)
  }

  private connect(): void {
    this.getConnection().connect()
  }

  private getConnection(): Connection {
    return this.connection
  }

  private end(): void {
    this.getConnection().end()
  }

  private async queryData(sql: string, values: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.getConnection().query(sql, values, (error, rows) => {
        if (error) {
          reject(error)
        }

        resolve(rows)
      })
    })
  }

  public async query(sql: string, values?:any[]) {
    let results: any[]

    this.connect()
    results = await this.queryData(sql, values ? values : [])
    this.end()

    return results
  }
}

export default MysqlManager

