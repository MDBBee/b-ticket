import { useEffect, useState } from 'react';

const OrderShow = ({ order }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const calcTimeLeftSeconds = () => {
      const timeLeftSeconds = (new Date(order.expiresAt) - new Date()) / 1000;
      setTime(Math.round(timeLeftSeconds));
    };

    calcTimeLeftSeconds();
    const timerId = setInterval(calcTimeLeftSeconds, 1000);

    return () => clearInterval(timerId);
  }, []);
  //   console.log(order);

  return time < 0 ? (
    <h2>Allocated time for purchase expired! </h2>
  ) : (
    <div>
      <h2>Purchasing {order.ticket.title}</h2>
      <p>
        Time Left to Pay: <span style={{ fontWeight: 'bold' }}>{time}</span>{' '}
        seconds
      </p>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
export default OrderShow;
