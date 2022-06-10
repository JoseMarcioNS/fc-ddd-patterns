import CustomerAddressChandedEvent from "../../customer/event/customer-address-changed";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import PrintConsoleOneWhenCustomerIsCreatedHandler from "../../customer/event/handler/print-console-One-when-customer-is-created.handle";
import PrintConsoleTwoWhenCostumerIsCreatedHandler from "../../customer/event/handler/print-console-Two-when-customer-is-created.handle";
import PrintConsoleWhenCustomerAddressIsChandendHandle from "../../customer/event/handler/print-console-when-customer-address-is-chandend.handle";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
  it("should notify all customer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    
    const printConsoleOneHandler = new PrintConsoleOneWhenCustomerIsCreatedHandler();
    const printConsoleTwoHandler = new PrintConsoleTwoWhenCostumerIsCreatedHandler();
    
    const spyEventPrintConsoleOneHandler = jest.spyOn(printConsoleOneHandler, "handle");
    const spyEventPrintConsoleTwoHandler = jest.spyOn(printConsoleTwoHandler, "handle");
   
    eventDispatcher.register("CustomerCreatedEvent", printConsoleOneHandler);
    eventDispatcher.register("CustomerCreatedEvent", printConsoleTwoHandler);
   
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(printConsoleOneHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(printConsoleTwoHandler);

     const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "João",
      Address: {
        street: "Rua da Paz",
        number: "10",
        zip: "11111-222",
        city: "São Paulo",
      }
    });
  
    eventDispatcher.notify(customerCreatedEvent);
    expect(spyEventPrintConsoleOneHandler).toHaveBeenCalled();
    expect(spyEventPrintConsoleTwoHandler).toHaveBeenCalled();

  });
  it("should notify all customer changed event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    
    const printConsoleaddressChangedHandler = new PrintConsoleWhenCustomerAddressIsChandendHandle();
    const spyEventprintConsoleaddressChangedHandler = jest.spyOn(printConsoleaddressChangedHandler, "handle");
    eventDispatcher.register("CustomerAddressChangedEvent", printConsoleaddressChangedHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(printConsoleaddressChangedHandler);

    const customerAddressChanged = new CustomerAddressChandedEvent({
      id: "1",
      name: "João",
      Address: {
        street: "Rua da Felicidade",
        number: "10",
        zip: "22222-333",
        city: "São Paulo",
      }
    })

   eventDispatcher.notify(customerAddressChanged);
   expect(spyEventprintConsoleaddressChangedHandler).toHaveBeenCalled();

  });
});
