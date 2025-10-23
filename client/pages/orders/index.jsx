const OrderIndex = ({ orders }) => {
  return (
    <div>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.ticket.title} - {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client, current) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};
export default OrderIndex;
