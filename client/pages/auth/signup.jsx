import { useState } from 'react';
import axios from 'axios';
const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Form inputs', password, email);

    const res = await axios.post('/api/users/signup', {
      email,
      password,
    });

    console.log('Response data', res.data);
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label htmlFor="">Email Address</label>
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button style={{ marginTop: '10px' }} className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
};
export default signup;
