import { Button } from '@/components/index';
import { FormikProps, Formik } from 'formik';
import * as Yup from 'yup';
import * as apiServer from '@/services/api.server';
import notification from '@/utils/notification';
import errorFormmatter from '@/utils/errorFormatter';
import { broadcastMessage } from '@/utils/agoraManager';

const CheckoutFormSchema = Yup.object().shape({
  receiverID: Yup.string().required('receiver id is required'),
  amount: Yup.number().required('amount is required'),
});

const initialValue = {
  receiverID: '',
  amount: 0,
};
interface IFormValues {
  receiverID: string;
  amount: number;
}

const TransferCredit = ({ platformUsers = [], user, broadcastLink }: any) => {
  const checkoutPayment = async (values: IFormValues) => {
    try {
      const response = await apiServer.transferToPlatformUser({
        receiverID: values.receiverID,
        amount: values.amount,
      });

      notification({
        title: 'Credit transfer',
        message: response.result.message,
      });
      const payload = {
        type: 'payment',
        text: `${user.user_email} sent you ${values.amount} credits`,
        author: '🤖 Bot',
      };
      await broadcastMessage(broadcastLink, payload);
    } catch (error) {
      notification({
        type: 'danger',
        title: 'Credit transfer',
        message: errorFormmatter(error) ?? '',
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValue}
        onSubmit={checkoutPayment}
        validate={(values) => {
          const errors: { [key: string]: any } = {};
          if (values.amount === 0) {
            errors.amount = 'Amount must be greater than 0 ';
          }
          return errors;
        }}
        validationSchema={CheckoutFormSchema}
      >
        {(props: FormikProps<IFormValues>) => {
          return (
            <div className='max-w-sm mx-auto mb-[20px] p-6 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200 tracking-wider bg-gray-200'>
              <label
                htmlFor='countries'
                className='block mb-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200 tracking-wider bg-gray-200'
              >
                Select user to credit
                <select
                  onChange={props.handleChange}
                  name='receiverID'
                  id='countries'
                  className='mb-[2px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                >
                  <option defaultChecked={true} value={'None'}>
                    None
                  </option>
                  {platformUsers.map((user: any) => {
                    return (
                      <option value={user.user_id}>{user.user_email}</option>
                    );
                  })}
                </select>
                <span className='block text-red-500'>
                  {props.errors.receiverID}
                </span>
              </label>

              <label
                htmlFor='amount'
                className='block mb-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200 tracking-wider bg-gray-200'
              >
                Amount
                <input
                  defaultValue={0}
                  onChange={props.handleChange}
                  name='amount'
                  type='number'
                  id='amount'
                  aria-describedby='helper-text-explanation'
                  className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='$0.00'
                />
                <span className='block text-red-500'>
                  {props.errors.amount}
                </span>
              </label>

              <p
                id='helper-text-explanation'
                className='mt-2 text-sm text-gray-500 dark:text-gray-400 mb-[20px]'
              >
                We’ll never share your details. Read our{' '}
                <a
                  href='#'
                  className='font-medium text-blue-600 hover:underline dark:text-blue-500'
                >
                  Privacy Policy
                </a>
                .
              </p>
              <Button type='button' onClick={props.handleSubmit}>
                <span className="relative px-5 py-2.5 transition-all hover:bg-gray-700 ease-in duration-75 rounded-md ">
                Send credit
                </span>
              </Button>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default TransferCredit;
