import Link from 'next/link';

const Landing = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((t) => (
    <tr className="" key={t.id}>
      <td> {t.title}</td>
      <td> {t.price}</td>
      <td>
        {' '}
        <Link href={`/tickets/${t.id}`}>View</Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

Landing.getInitialProps = async (context, client, current) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Landing;
