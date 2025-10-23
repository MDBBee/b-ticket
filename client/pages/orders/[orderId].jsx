import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [time, setTime] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

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
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51SKtFi2QvD6dI8ftkbvYcze2D6kFyy6KWjkuUYi3vUNyprxvtpOMeT4AffKDxXu6S3S7nd1MAuECuilFpFfPggpP00K9iRvoJR"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
export default OrderShow;
