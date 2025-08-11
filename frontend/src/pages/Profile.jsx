import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isCustomer = queryParams.get('isCustomer') === 'true';

  console.log('isCustomer:', isCustomer);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Customer: {isCustomer ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default Profile;
