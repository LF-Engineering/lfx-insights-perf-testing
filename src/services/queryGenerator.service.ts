export class QueryGeneratorService {

  // handle `order by` part by adding a correct `order by column-name asc|desc` phrase in place of `:order` placeholder
  static handleOrderBy<T extends string>(query: string, order: T, asc: boolean, allowedOrders: Set<T>, defaultOrder: T) : string {
    if (!allowedOrders.has(order)) {
      order = defaultOrder
      console.log('unknown order by column ' + order + ', changed to ' + order);
    }
    const queryOrderBy = ` order by ${order} ${asc ? 'asc' : 'desc'}`;
    return query.replace(/:order/g, queryOrderBy);
  }

}
