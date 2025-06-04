import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {


  const navigate = useNavigate();

  const TCRow = ({ title,to='/' }) => (
    <div className="flex justify-between items-center border p-4 rounded-md shadow-sm mb-4 bg-white">
      <p className="font-medium">{title}</p>
      <div className="flex gap-3">
        <FiEdit
          className="cursor-pointer text-blue-500"
          size={18}
          onClick={() => navigate(to)}
        />
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">Privacy Policy</h2>

      <div className="mb-8">
        <TCRow title="User Privacy Policy" to='/content/privacy-policy/user' />
      </div>

      <div>
        <TCRow title="Delivery Partner Privacy Policy" to='/content/privacy-policy/delivery'/>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
