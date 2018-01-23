var mysql = require("mysql");
var inquirer = require("inquirer");

var table;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
 	greeter();
});
function greeter(){
	inquirer.prompt([
	{
		type: "list",
		name: "initialResponse",
		message: "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ \nWelcome to Bamazon. We offer a wide variety of high-end products. If you are poor, leave or our drone army will find you.  \nCare to window shop?",
		choices: ["List an Item","Buy an Item", "get the fuck out"]
	}
		]).then(function(first){
			if(first.initialResponse == "List an Item") {
				addCLI();
			}
			else if (first.initialResponse == "Buy an Item") {
				toTable();

			}
			else {
				connection.end()
			}
		})
}

function addCLI(){
	inquirer.prompt([
	{
		type: "input",
		name: "itemResponse",
		message: "What possible item could you contribute to the top 1%?"
	},

	{
		type: 'imput',
		name: "priceResponse",
		message: "sigh....\nAnd just how much do you think its worth?"
	},

	{
		type: 'imput',
		name: 'quantityRepsonse',
		message: 'And how much of that crap do you have?'
	}
	]).then(function(add){
		console.log("we will review your item. No, we'll call you.")
		var item = add.itemResponse;
		var price = add.priceResponse;
		var quantity = add.quantityRepsonse;
		create(item, price, quantity);

		// reiterate("would you like to add another item?");
	})
}
function reiterate(message){
	inquirer.prompt([
	{
		type: "confirm",
		name: "reiterate",
		message: message
	}
	]).then(function(again){
		if(again.reiterate){
				addCLI();
		}
		else{
				greeter();
		}
	})
}
function toTable(){
  	connection.query("SELECT * FROM productlist", function(err, res) {
    if (err) throw err;
    table = res;
    printTable();
    askBuy();
  });
}
function printTable(){

	for (var i = 0; i < table.length; i++) {
      console.log(table[i].item_id + " | Item: " + table[i].product_name + " | Price : $" + table[i].price + " | quantity " + table[i].quantity);
    }
}
function askBuy(){
		inquirer.prompt([
	{
		type: "input",
		name: "choosenid",
		message: "Choose an item by ID you would like to buy"
	},
	{
		type: "input",
		name: "choosenQuantity",
		message: "just how many can you afford?"
	}
	]).then(function(buy){
		var choosenid = table[buy.choosenid -1].product_name;
		var choosenQuantity = buy.choosenQuantity;
		console.log("choosenid: "+ buy.choosenid+"choosenQuantity: "+choosenQuantity)
		if(choosenQuantity > table[buy.choosenid].quantity){
			console.log("not even I cannot provide what does not exist");
		}
		else {
			var newQuantity = table[buy.choosenid].quantity - choosenQuantity;
			update(newQuantity, choosenid);
			console.log('you now owe us '+choosenQuantity*table[buy.choosenid].price+' dollars.')
		}

	})
}
function create(item, price, quantity) {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO productlist SET ?",
    {
      product_name: item,
      price: price,
      quantity: quantity,
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
    }
  );

  // logs the actual query being run
  console.log(query.sql);
  reiterate("Care to waste more of my time?");
}

function read() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM productlist", function(err, res) {
    if (err) throw err;
    console.log(res);
  });
}

function update(quantity, item) {
  var query = connection.query(
    "UPDATE productlist SET ? WHERE ?",
    [
      {
        quantity: quantity
      },
      {
        product_name: item
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " products updated!\n");
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

// function delete(item) {
//   // console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM list WHERE ?",
//     {
//       item: item,
//     },
//     function(err, res) {
//       console.log(res.affectedRows + " products deleted!\n");
//     }
//   );
// }



