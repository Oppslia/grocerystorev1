
import { GroceryStore as gs } from './models/GroceryStore.mjs'
import { Inventory as inventory } from './models/Inventory.mjs'
let gs1 = new gs()
 
// gs.inventory.getCount('produce')
// gs.inventory.getCount('deli')



console.log("1st Get Test",gs1.inventory.get('s31242'),"\n\n")
gs1.inventory.add({'itemID':'s31299', 'price': 4.59, 'category': 'deli', 'quantity': 20})
console.log("added an item", gs1.inventory.get('s31299'),"\n\n")

gs1.inventory.update({'itemID':'s31242', 'price': 4.5, 'category': 'lolrekt'})
console.log("Updated an item",gs1.inventory.get('s31242'),"\n\n")

gs1.inventory.remove('s31242')
console.log("Removed an item", gs1.inventory.get('s31242'),"\n\n")


console.log("Get entire STORE inventory", gs1.inventory.getAll(),"\n\n")

gs1.inventory.restore('s31242')
console.log("Restored that item", gs1.inventory.get('s31242'),"\n\n")

console.log("Get entire STORE inventory. The item is back", gs1.inventory.getAll(),"\n\n")

gs1.checkout([{"s31242":5},{"s31243":15}])
console.log("Checking out with 5 apples and 15 oranges\n")
console.log("Item Inventory reduced", gs1.inventory.get('s31242'))
console.log("Item Inventory reduced", gs1.inventory.get('s31243'),"\n\n")
console.log(gs1.getReceipts())
 

// gs.getTotalReceipts() 