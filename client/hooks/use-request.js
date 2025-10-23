import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(res.data);
      }

      return res.data;
    } catch (error) {
      console.log('ERROR FROM USEREQUEST⚠️⚠️', error);

      setErrors(
        <div className="alert alert-danger">
          <h4>🙊🙊Aaaahhh..</h4>
          <ul className="my-0">
            {error.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
