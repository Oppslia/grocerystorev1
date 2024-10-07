    import { db } from './db.mjs';
    import { Inventory } from './Inventory.mjs';
    export class GroceryStore{
        #receiptlog = new Map()    
        constructor(){
            this.storeID = "D6311"
            this.database = new db(this)
            this.inventory = new Inventory(this)//pass the class object.
        }
        #storeReceipt(receipt){
            const transactionID = `${new Date().toLocaleString()}`
            this.#receiptlog[transactionID] = receipt
        }
        /**
         * @param {Array<>} items
        */
        #buildReceipt(items){
            const maxReceiptWidth = 40
            let maxItemName = 0
            let maxQuantity = 0
            items.forEach(item=>{
                maxItemName = item.itemName.length >= maxItemName ? item.itemName.length : maxItemName
            })
            items.forEach(item=>{
                maxQuantity = item.quantity.toString().length >= maxQuantity ? item.quantity.toString().length : maxQuantity
            })
            
            let receipt = items.map(item =>{
                for(let i=item.quantity.toString().length ; i <= maxItemName ; i++){
                    item.itemName += " "
                }
                let quantitySpaces = ''
                for(let i=item.quantity.toString().length ; i <= maxQuantity ; i++){
                    quantitySpaces += ' '
                }
                let dots = ''
                for(let i=0;i<=(maxReceiptWidth - item.itemID.length - item.itemName.length);i++){
                    dots += '.'
                }
                return`${item.quantity}${quantitySpaces}${item.itemName}${item.itemID}${dots}${item.price.toFixed(2)}`
            }
            )
            this.#storeReceipt(receipt)
            return receipt
        }
        getReceipts(){
            return this.#receiptlog
        }
        checkout(boughtItems){
            const items = []
            for(let x in boughtItems){
                let c = {...this.inventory.items.find(existingItem => existingItem.itemID === Object.keys(boughtItems[x])[0])} // shallow copy of the item for reference
                this.inventory.update({"itemID": Object.keys(boughtItems[x])[0], "quantity": this.inventory.items.find(existingItem => existingItem.itemID === Object.keys(boughtItems[x])[0]).quantity - boughtItems[x][Object.keys(boughtItems[x])[0]]})
                c.quantity = boughtItems[x][Object.keys(boughtItems[x])[0]]
                
                //gs1.checkout([{"s31242":5},{"s31243":15}])
                items.push(c)
            }
            return this.#buildReceipt(items)
            
        }
        
        


        

    }