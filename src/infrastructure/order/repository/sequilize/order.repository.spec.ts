import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should create a new order and update", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const ordemItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem,ordemItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.items.length).toBe(2)

    order.removeItemById("2")
    await orderRepository.update(order);
   
  const orderModelUpdate = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModelUpdate.items.length).toBe(1)
  })
  it("should create a new order and update", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const ordemItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem,ordemItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.items.length).toBe(2)

    order.removeItemById("2")
    await orderRepository.update(order);
    console.log("Items " + order.items.length)

    const orderModelUpdate = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModelUpdate.items.length).toBe(1)
  })

  it("Find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("10", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("10", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("10", "10", [ordemItem]);
    const orderRepository = new OrderRepository();
     await orderRepository.create(order);

     const orderModel = await OrderModel.findOne({
      where: { id: "10" },
      include: ["items"],
    });
    
     const orderResult = await orderRepository.find("10")

     expect(orderModel.toJSON()).toStrictEqual({
      id: orderResult.id,
      customer_id: orderResult.customerId,
      total: orderResult.total(),
      items: [
        {
          id: orderResult.items[0].id,
          name: orderResult.items[0].name,
          price: orderResult.items[0].price,
          quantity: orderResult.items[0].quantity,
          order_id: orderResult.id,
          product_id: orderResult.customerId,
        },
      ],
    });
    })
    it("should find all order", async () => {
     
      const customerRepository = new CustomerRepository();
      const customer = new Customer("10", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);

      
      const customer2 = new Customer("11", "Customer 1");
      const address2 = new Address("Street 2", 1, "Zipcode 1", "City 1");
      customer2.changeAddress(address2);
      await customerRepository.create(customer2);
     
      const productRepository = new ProductRepository();
      const product = new Product("10", "Product 1", 10);
      await productRepository.create(product);

      const product2 = new Product("11", "Product 2", 10);
      await productRepository.create(product2);
  
      const ordemItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
      const ordemItem2 = new OrderItem(
        "2",
        product2.name,
        product2.price,
        product2.id,
        2
      );
  
      const order = new Order("1", "10", [ordemItem]);
      const order2 = new Order("2", "11", [ordemItem2]);
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);
      await orderRepository.create(order2);
      
     const allOrder = await orderRepository.findAll();
     const orders = [order,order2];
     
     expect(orders).toEqual(allOrder); 
      
   });
});
