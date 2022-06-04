import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
 
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  async update(entity: Order): Promise<void> {

    const orderModelUpdate = await OrderModel.findOne({
      where: { id: entity.id },
      include: ["items"],
    });
    
    orderModelUpdate.items.forEach((item,index)=>{
      if(entity.items.findIndex(i => i.id == item.id) === -1) 
      OrderItemModel.destroy({
        where: {
          id: item.id 
        }
       })
     })
     await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
       },
       {
        where: {
          id: entity.id,
        },
      }
   );
 }
 async find(id: string): Promise<Order> {

    const orderModel = await OrderModel.findOne({
      where: { id: id },
      include: ["items"],
    });
    const items: OrderItem[] = [];

      orderModel.items.forEach((item)=>{
        items.push(new OrderItem(item.id,item.name,item.price / item.quantity,item.product_id, item.quantity))
    })
    
    return new Order(orderModel.id, orderModel.customer_id, items);
    
  }
 async findAll(): Promise<Order[]> {
  const orderModels = await OrderModel.findAll({include: ["items"]});
  const orders : Order[] = [];
  let items: OrderItem[] = [];

  orderModels.map((orderModel) => {
     
      orderModel.items.forEach((item)=>{
      items.push(new OrderItem(item.id,item.name,(item.price / item.quantity),item.product_id, item.quantity))
      }),
      orders.push(new Order(orderModel.id,orderModel.customer_id,items))
      items = [];
    }
    )
    return orders;
   }
   
}
