const Order = require("./Order");

const burger = [
  "Junior Kid's Meal Hamburger",
  "Junior Bacon Deluxe Hamburger",
  "Cheesy Cheddar Hamburger",
  "Single Cheese Hamburger",
  "Baconator Hamburger",
  "Spicy Chicken Burger",
  "Classic Chicken Burger",
  "None"
]
const burger_price = [
  4.25,
  5,
  4.5,
  8.5,
  13,
  12.25,
  12.75,
  0
]
const drink = [
  "Small Drink Freestyle",
  "Medium Drink Freestyle",
  "Large Drink Freestyle",
  "None"
]
const drink_price = [
  3,
  5,
  6.5,
  0
]
const fries = [
  "Small Fries",
  "Medium Fries",
  "Large Fries",
  "None"
]
const fries_price = [
  4.5,
  6.25,
  7.75,
  0
]

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    BURGER:   Symbol("burger"),
    BURGERQUAN:   Symbol("burgerquan"),
    WANTDRINK:   Symbol("wantdrink"),
    DRINK:   Symbol("drink"),
    WANTFRIES:   Symbol("wantfries"),
    FRIES:  Symbol("fries"),
    PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sBurger = "";
        this.qBurger = "";
        this.wDrink = "";
        this.sDrink = "";
        this.wFries = "";
        this.sFries = "";
        this.sItem = "Burgers";
    }
    handleInput(sInput){
      let aReturn = [];
      let temp = "";
      switch(this.stateCur){
          case OrderState.WELCOMING:
              this.stateCur = OrderState.BURGER;
              aReturn.push("Welcome to Ketan's Burgers.");
              temp = `Which burger would you like today?
              `;
              for(let i=0; i<burger.length; i++){
                  temp+= `${i+1}) ${burger[i]}
                  `
              }
              aReturn.push(temp);
              break;
          case OrderState.BURGER:
              this.sBurger = sInput;
              if(this.sBurger!='8'){
                  this.stateCur = OrderState.BURGERQUAN
                  aReturn.push("And how many would you like?")
              }
              else{
                  this.stateCur = OrderState.WANTDRINK
                  aReturn.push("Would you like a drink?");
              }
              break;
          case OrderState.BURGERQUAN:
              this.stateCur = OrderState.WANTDRINK
              this.qBurger = sInput;
              aReturn.push("Would you like a drink with that?");
              break;
          case OrderState.WANTDRINK:
              this.wDrink = sInput;
              if(this.wDrink.toLowerCase()=='yes'||this.wDrink.toLowerCase()=='y'){
                  this.stateCur = OrderState.DRINK
                  temp = `Which drink would you like?
                  `;
                  for(let i=0; i<drink.length; i++){
                      temp+= `${i+1}) ${drink[i]}
                      `
                  }
                  aReturn.push(temp);
              }
              else{
                  aReturn.push("Would you like some fries?")
                  this.stateCur = OrderState.WANTFRIES
              }
              break;
          case OrderState.DRINK:
              this.stateCur = OrderState.WANTFRIES
              this.sDrink = sInput;
              if(this.sDrink!='4'){
                  aReturn.push("Would you also like some fries on the side with that?");
              }
              else{
                  aReturn.push("Would you like some fries?")
              }
              break;
          case OrderState.WANTFRIES:
              this.wFries = sInput;
              if(this.wFries.toLowerCase()=='yes'||this.wFries.toLowerCase()=='y'){
                  this.stateCur = OrderState.FRIES
                  temp = `Which fries would you like?
                  `;
                  for(let i=0; i<fries.length; i++){
                      temp+= `${i+1}) ${fries[i]}
                      `
                  }
                  aReturn.push(temp);
              }
              else{
                  this.stateCur = OrderState.PAYMENT
                  this.isDone(true);
                  let total = 0;
                  temp = `Thank-you for your order of
                  `
                  if(this.sBurger!='8'){
                      total+=burger_price[parseInt(this.sBurger)-1]*parseInt(this.qBurger);
                      temp+=`${burger[parseInt(this.sBurger)-1]} X ${parseInt(this.qBurger)}: $${burger_price[parseInt(this.sBurger)-1].toFixed(2)}
                      `
                  }
                  if(this.sDrink!=''&&this.sDrink!='4'){
                      total+=drink_price[parseInt(this.sDrink)-1];
                      temp+=`${drink[parseInt(this.sDrink)-1]}: $${drink_price[parseInt(this.sDrink)-1].toFixed(2)}
                      `
                  }
                  if(this.sFries!=''&&this.sFries!='4'){
                      total+=fries_price[parseInt(this.sFries)-1];
                      temp+=`${fries[parseInt(this.sFries)-1]}: $${fries_price[parseInt(this.sFries)-1].toFixed(2)}
                      `
                  }
                  aReturn.push(temp);
                  aReturn.push(`ORDER DETAILS
                  ***************************
                  Order Total: $${total.toFixed(2)}
                  Tax (13%): $${(total*0.13).toFixed(2)}
                  Grand Total: $${(total*1.13).toFixed(2)}`);
              
                  this.nOrder = parseFloat((total*1.13).toFixed(2));
                  aReturn.push(`Please pay for your order here`);
                  aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                  break;
              }
              break;
          case OrderState.FRIES:
              this.stateCur = OrderState.PAYMENT
              this.isDone(true);
              this.sFries = sInput;
              let total = 0;
              temp = `Thank-you for your order of
              `
              if(this.sBurger!='8'){
                  total+=burger_price[parseInt(this.sBurger)-1]*parseInt(this.qBurger);
                  temp+=`${burger[parseInt(this.sBurger)-1]} (${parseInt(this.qBurger)}): $${burger_price[parseInt(this.sBurger)-1].toFixed(2)}
                  `
              }
              if(this.sDrink!=''&&this.sDrink!='4'){
                  total+=drink_price[parseInt(this.sDrink)-1];
                  temp+=`${drink[parseInt(this.sDrink)-1]}: $${drink_price[parseInt(this.sDrink)-1].toFixed(2)}
                  `
              }
              if(this.sFries!=''&&this.sFries!='4'){
                  total+=fries_price[parseInt(this.sFries)-1];
                  temp+=`${fries[parseInt(this.sFries)-1]}: $${fries_price[parseInt(this.sFries)-1].toFixed(2)}
                  `
              }
              aReturn.push(temp);
              aReturn.push(`ORDER DETAILS
              ***************************
              Order Total: $${total.toFixed(2)}
              Tax (13%): $${(total*0.13).toFixed(2)}
              Grand Total: $${(total*1.13).toFixed(2)}`);

              this.nOrder = parseFloat((total*1.13).toFixed(2));
              aReturn.push(`Please pay for your order here`);
              aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
              break;
          case OrderState.PAYMENT:
              console.log(sInput);
              temp = 'ADDRESS<br>*************************<br>';
              for(let key in sInput.payer.address){
                temp += `${key}: ${sInput.payer.address[key]}<br>`;
              }
              aReturn.push(temp);
              this.isDone(true);
              let d = new Date();
              d.setMinutes(d.getMinutes() + 20);
              aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
              break;
      }
      return aReturn;
  }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
        <script src ="/js/store.js" type = "module"></script>

        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    details.order = ${JSON.stringify(this)};
                    window.StoreData(details); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}