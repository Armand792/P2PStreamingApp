import { Button, Input, InputFieldItem } from '@/components/index';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import * as apiServer from '@/services/api.server';
import notification from '@/utils/notification';
import errorFormmatter from '@/utils/errorFormatter';
import { useRouter } from 'next/navigation';
import { saveLoginData } from '@/store/reducers/user.reducers';
import { useAppDispatch } from '@/utils/hooks/store.hooks';
import { ILoginPayload } from '@/interfaces/user.interface';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('please enter a valid email address')
    .required('email is required'),
  password: Yup.string().required('password is required'),
});

const initialValue = {
  email: '',
  password: '',
};

interface IFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const history = useRouter();
  const dispatch = useAppDispatch();

  const login = async (values: IFormValues) => {
    try {
      const payload: ILoginPayload = {
        email: values.email,
        password: values.password,
      };
      const response = await apiServer.login(payload);
      dispatch(
        saveLoginData({
          token: response.result.data[0].token,
          user_id: response.result.data[0].user_id,
        })
      );

      notification({
        title: 'Login',
        message: response.result.message,
      });

      history.push('/');
    } catch (error) {
      notification({
        title: 'Login',
        type: 'danger',
        message: errorFormmatter(error) ?? 'unexpected error occur',
      });
    }
  };

  return (
    <main className='my-[4rem] w-full max-w-[640px] min-h-[640px] [padding-left:_clamp(1rem,2vw,calc(64rem_/_16))]  [padding-right:_clamp(1rem,2vw,calc(64rem_/_16))]   py-[32px]  bg-gray-100 dark:bg-gray-700 rounded-2xl shadow justify-center items-center gap-2 inline-flex mx-auto'>
      <Formik
        initialValues={initialValue}
        onSubmit={login}
        validationSchema={LoginSchema}
      >
        {(props: FormikProps<IFormValues>) => {
          return (
            <section className='w-full h-full justify-center items-center gap-2 flex flex-col'>
              <div className='w-full flex-col justify-between items-start inline-flex'>
                <h1 className="self-stretch text-center dark:text-gray-200 p-4 text-4xl font-extrabold ">
                  Login
                </h1>
              </div>
              <form className='max-w-[400px] w-full'>
                <InputFieldItem
                  isError={props.errors.email ? true : false}
                  message={props.errors.email}
                >
                  <Input
                    name='email'
                    onChange={props.handleChange}
                    placeholder='email'
                    label='Email'
                    isError={props.errors.email ? true : false}
                  />
                </InputFieldItem>
                <InputFieldItem
                  isError={props.errors.password ? true : false}
                  message={props.errors.password}
                >
                  <Input
                    type='password'
                    placeholder='Password'
                    label='Password'
                    name='password'
                    isError={props.errors.password ? true : false}
                    onChange={props.handleChange}
                  />
                </InputFieldItem>
              </form>

              <Button
                className='!max-w-[400px] '
                isLoading={props.isSubmitting}
                onClick={props.handleSubmit}
                type='button'
                disabled={
                  Object.keys(props.errors).length > 0 || !props.dirty
                    ? true
                    : false
                }
              >
                <span className="text-white text-base p-2 font-normal ">
                  {' '}
                  Login
                </span>
              </Button>
            </section>
          );
        }}
      </Formik>
    </main>
  );
};

export default Login;
