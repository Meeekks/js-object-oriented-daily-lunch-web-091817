let store = {customers: [], meals: [], deliveries: [], employers: []}

let customerId = 0;
let mealId = 0;
let deliveryId = 0;
let employerId = 0;

class Customer {
  constructor(name, employer) {
    this.id = ++customerId;
    this.name = name;
    if (employer) {this.employerId = employer.id};
    store.customers.push(this);
  }

  meals() {
    let meals = [];
    store.deliveries.forEach(function(delivery){
      if (delivery.customerId === this.id) {
        meals.push(delivery.meal());
      }
    }.bind(this))
    return meals;
  }

  deliveries() {
    return store.deliveries.filter(function(delivery) {
      return this.id === delivery.customerId;
    }.bind(this))
  }

  totalSpent() {
    return this.meals().reduce(function(acc, meal) {
      return acc + meal.price;
    }.bind(this), 0)
  }
}

class Meal {
  constructor(title, price) {
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
  }

  deliveries() {
    return store.deliveries.filter(function(delivery) {
      return this.id === delivery.mealId;
    }.bind(this))
  }

  customers() {
    return store.deliveries.map(function(delivery){
      if (delivery.mealId === this.id) {
        return delivery.customer();
      }
    }.bind(this))
  }

  static byPrice() {
    return store.meals.sort(function(a, b) {
      return b.price - a.price;
    })
  }
}

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId;
    if (meal) {this.mealId = meal.id};
    if (customer) {this.customerId = customer.id};
    store.deliveries.push(this);
  }
  meal() {
    return store.meals.find(function(meal) {
      return this.mealId === meal.id;
    }.bind(this))
  }
  customer() {
    return store.customers.find(function(customer) {
      return this.customerId === customer.id;
    }.bind(this))
  }
}

class Employer {
  constructor(name) {
    this.id = ++employerId;
    this.name = name;
    store.employers.push(this);
  }
  employees() {
    return store.customers.filter(function(customer) {
      return this.id === customer.employerId;
    }.bind(this))
  }

  deliveries() {
    let newArray = []
    store.customers.forEach(function(customer) {
      if (this.id === customer.employerId) {
        customer.deliveries().forEach(function(delivery) {
          newArray.push(delivery)
        });
      }
    }.bind(this))
    return newArray;
  }


  meals() {
    let newArray = []
    store.customers.forEach(function(customer) {
      if (this.id === customer.employerId) {
        customer.deliveries().forEach(function(delivery) {
          if (!newArray.includes(delivery.meal())) {
            newArray.push(delivery.meal())
          }
        });
      }
    }.bind(this))
    return newArray;
  }

  mealTotals() {
    let newHash = {};
    this.deliveries().forEach(function(delivery) {
      let meal = delivery.meal();
      if (newHash[meal.id]) {
        newHash[meal.id] += 1;
      } else {
        newHash[meal.id] = 1;
      }
    }.bind(this));
    return newHash;
  }

}
