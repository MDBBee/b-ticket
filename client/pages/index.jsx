import axios from 'axios';

const index = ({ currentUser }) => {
  console.log(currentUser);
  axios.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
  });

  return <h1>Landing Page</h1>;
};

// index.getInitialProps = async () => {
//   const res = await axios.get('/api/users/currentuser');

//   return res.data;
// };

export default index;
