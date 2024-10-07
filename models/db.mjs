import mysql from 'mysql2/promise'
export class db{
  #mockInventory = []
  #connection
  #tables
  #columns
  #defaultItemTemplate = {
    itemID: '',
    itemName: '',
    quantity: 0,
    price: 0.0,
    category: '',
    hidden: false
};
  
  constructor(store){
    this.dbName = `${store.storeID}_Inventory`
    //this.#createDatabase(this.#createInitialStatements())
    this.#mockInventory.push(
      {
          itemID: 's31242',
          itemName: 'Apple',
          quantity: 50,
          price: 0.99,
          category: "Produce",
          hidden: false
      },
      {
          itemID: 's31243',
          itemName: 'Orange',
          quantity: 30,
          price: 1.25,
          category: "Produce",
          hidden: false
      },
      {
          itemID: 's31244',
          itemName: 'Banana',
          quantity: 100,
          price: 0.79,
          category: "Produce",
          hidden: false
      },
      {
          itemID: 's31245',
          itemName: 'Grapes',
          quantity: 75,
          price: 2.99,
          category: "Produce",
          hidden: true
      },
      {
          itemID: 's31246',
          itemName: 'Milk',
          quantity: 20,
          price: 2.50,
          category: "Dairy",
          hidden: false
      }
  )
  }
  #createInitialStatements(){
    const table1Init = `
    CREATE TABLE IF NOT EXISTS \`${this.dbName}\`.\`items\`(
    \`itemID\` CHAR(36) NOT NULL PRIMARY KEY,
    \`itemName\` VARCHAR(255) NOT NULL,
    \`quantity\` INT,
    \`price\` INT NOT NULL,
    \`category\` VARCHAR(255),
    \`hidden\` TINYINT(1) DEFAULT 1 NOT NULL
    );`
    const tables = [table1Init]
    return tables
  }
  async #connectToDB(){
    try {
      this.#connection = await mysql.createConnection({
          host: '127.0.0.1',
          user: 'root',
          password: '',
      });
      console.log("Connection established.")
    } catch (err) {
        console.error("Error connecting to the database:", err)
        this.#connection = null // Set to null if connection fails
    }
  }
  async #createDatabase(createTableStatements){
    await this.#connectToDB()
    try {
      await this.#connection.query(`CREATE DATABASE IF NOT EXISTS ${this.dbName};`)
      await this.#connection.query(`USE ${this.dbName};`)
      for (const statement of createTableStatements){
        console.log(statement)
        await this.#connection.query(statement)
      }
      this.#tables = await this.#grabTables()
      this.#columns = await this.#grabColumns()
      console.log([this.#columns,this.#tables])
    } catch (err) {
      console.error("Error during database initialization:", err)
  }
}
  async #grabTables(){
    if (!this.#connection) {
      console.error("No database connection available. Cannot retrieve tables.");
      return []; // Return an empty array if no connection
    }
    const [rows] = await this.#connection.query("SHOW TABLES");
    //await this.#connection.end()
    return rows.map(row => Object.values(row)[0])
  }
  async #grabColumns(table){
    let sql = `SHOW COLUMNS FROM \`${this.#tables[0]}\`;`
    const [rows] = await this.#connection.query(sql)
    return rows.map(row => Object.values(row)[0])
  }

  getStoreInventoryALL(store){
    return this.#mockInventory
  }
  getStoreInventory(store){
    return this.#mockInventory.filter(item => !item.hidden)
  }
  insert(item){
    
    this.#mockInventory.push({...this.#defaultItemTemplate,...item})
    return
  }
  alter(item,delOrRes){
    const itemToUpdate = this.#mockInventory.find(existingItem => existingItem.itemID === item.itemID);
    if(delOrRes){
      itemToUpdate['hidden'] = itemToUpdate['hidden'] ? false : true;
    }
    for(let key in item){
      itemToUpdate[key] = item[key]
    }
    //Object.assign(itemToUpdate, item)
      
      console.log()
      return
    
  }
  test(){
    console.log(this.#tables)
    console.log(this.#columns)
  }


  }