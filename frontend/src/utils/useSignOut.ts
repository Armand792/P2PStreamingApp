import { useDispatch } from 'react-redux';
import { logout } from '@/store/reducers/user.reducers';
import { useRouter } from 'next/navigation';

const useSignOut = () => {
  const history = useRouter();
  const dispatch = useDispatch();

  const signUserOut = () => {
    dispatch(
      logout({
        user_id: '',
        token: '',
      })
    );
    history.push('/login');
  };
  return signUserOut;
};

export default useSignOut;
