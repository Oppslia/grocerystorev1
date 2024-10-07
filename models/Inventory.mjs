import { db } from './db.mjs';
export class Inventory {
    constructor(store){
        this.store = store
        this.items = this.store.database.getStoreInventory()//re
        this.storeID = store.storeID
    }
    refreshInventory(){ // gets the current inventory
        this.items = this.store.database.getStoreInventory(this.storeID)
    }
    getAll(){
        return this.store.database.getStoreInventory(this.storeID)
    }
    getCount(area = "all"){
        this.store.database.refreshInventory()
        const areaSpecificItems = []
        if(area === "all"){return this.items.length}
        for(item of this.items){
            if (item.category[area]){
                areaSpecificItems.push(item)
            }
        }return areaSpecificItems.length
    }
    get(itemID){
        this.refreshInventory()// refresh this to actually call database instea dof checking inv to allow for hidden items
        let allItems = this.store.database.getStoreInventoryALL()
        const x = allItems.find(item => item.itemID === itemID)
        return x

    }
    add(newItem){
        const result = this.store.database.insert(newItem)
        if (result){
            this.store.database.refreshInventory()
            return result
        }
        return result // failed
    }
    update(item, remOrRes = false){
        const result = remOrRes ?  this.store.database.alter(item,remOrRes) :  this.store.database.alter(item);
        if (result){this.store.database.refreshInventory(); return result}
        return result // failed
    }
    remove(itemID){
        const x = this.items.find(item => item.itemID === itemID)
        this.update(x, true)
    }
    restore(itemID){
        const x = this.store.database.getStoreInventoryALL().find(item => item.itemID === itemID)
        this.update(x, true)/// both pass true since the values will just flip on call. no sense in passing false.

    }


}