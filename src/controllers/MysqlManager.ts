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

  private getConnection(): Connection {
    return this.connection
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

    results = await this.queryData(sql, values ? values : [])

    return results
  }
}

export default MysqlManager

