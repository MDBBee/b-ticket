import buildClient from '../api/build-client';

const index = ({ currentUser }) => {
  return currentUser ? <h1>You are signed In</h1> : <h1>Signed Out</h1>;

  return <h1>Landing Page</h1>;
};

index.getInitialProps = async (context) => {
  const res = await buildClient(context).get('/api/users/currentuser');
  return res.data;
};

export default index;
