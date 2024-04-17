import notification from '@/utils/notification';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import * as apiServer from '@/services/api.server';
import { Button } from '@/components/index';

const ConfirmPayment = () => {
  const params = useSearchParams();
  const history = useRouter();

  const status = params.get('redirect_status');
  const amount = params.get('amount') ?? '0';

  const confirmPayment = async () => {
    try {
      await apiServer.confirmPayment({
        status: status ?? '',
        amount: parseFloat(amount),
      });
      history.push('/');
    } catch (error) {
      notification({
        title: 'Payment',
        message: 'Payment failed',
        type: 'danger',
      });
    }
  };

  const autoCheck = () => {
    if (params.get('redirect_status') === 'failed') {
      notification({
        title: 'Payment',
        message: 'Payment failed',
        type: 'danger',
      });
      history.push('/');
    }
  };

  useEffect(() => {
    autoCheck();
  }, []);

  useEffect(() => {
    autoCheck();
  }, [status]);

  return (
    <div className='max-w-sm m-auto flex flex-col justify-center'>
      <h1 className='mt-5 text-lg'>Hi, {params.get('user')}</h1>
      <h5 className='flex items-center gap-[0.8rem] '>
        You purchased a credit of
        <span className='text-green-500'>
          {' '}
          {params.get('currency')} {params.get('amount')}{' '}
        </span>
        <IoCheckmarkDoneCircle className='text-green-500 text-[1.5rem]' />
      </h5>

      <Button onClick={confirmPayment}>Continue</Button>

      {/* <Link href='/' className='text-blue-500 w-[max-content]'>
        Go back to home
      </Link> */}
    </div>
  );
};

export default ConfirmPayment;
