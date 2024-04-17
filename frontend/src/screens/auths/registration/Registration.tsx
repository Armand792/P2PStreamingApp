import { Button, Input, InputFieldItem } from '@/components/index';
import React from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import * as apiServer from '@/services/api.server';
import { IRegisterPayload } from '@/interfaces/user.interface';
import notification from '@/utils/notification';
import errorFormmatter from '@/utils/errorFormatter';
import { useRouter } from 'next/navigation';

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('please enter a valid email address')
    .required('email is required'),
  password: Yup.string().required('password is required'),
  confirmPassword: Yup.string().required('re-enter password to confirm'),
});

const initialValue = {
  email: '',
  password: '',
  confirmPassword: '',
};
interface IFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const Registration = () => {
  const history = useRouter();

  const registration = async (values: IFormValues) => {
    try {
      const payload: IRegisterPayload = {
        email: values.email,
        password: values.password,
      };
      const response = await apiServer.register(payload);

      notification({
        title: 'Registration',
        message: response.result.message,
      });

      history.push(`/login`);
    } catch (error) {
      notification({
        title: 'Registration',
        type: 'danger',
        message: errorFormmatter(error) ?? 'unexpected error occur',
      });
    }
  };

  return (
    <main className='my-[4rem] w-full max-w-[640px] min-h-[640px]  [padding-left:_clamp(1rem,2vw,calc(64rem_/_16))]  [padding-right:_clamp(1rem,2vw,calc(64rem_/_16))]   py-[32px]  bg-gray-100 dark:bg-gray-700 rounded-2xl shadow justify-center items-center gap-2 inline-flex mx-auto'>
      <Formik
        initialValues={initialValue}
        onSubmit={registration}
        validationSchema={RegisterSchema}
        validate={(values: IFormValues) => {
          const errors: { [key: string]: any } = {};

          if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 're-enter valid password';
          }
          return errors;
        }}
      >
        {(props: FormikProps<IFormValues>) => {
          return (
            <section className='w-full h-full justify-center items-center gap-2 flex flex-col'>
              <div className='w-full  flex-col justify-between items-start inline-flex'>
                <h1 className="self-stretch text-center dark:text-gray-200 p-4 text-4xl font-extrabold ">
                  Sign up
                </h1>
              </div>

              <form className='max-w-[400px] dark:text-gray-200  w-full'>
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
                <InputFieldItem
                  isError={props.errors.confirmPassword ? true : false}
                  message={props.errors.confirmPassword}
                >
                  <Input
                    type='password'
                    name='confirmPassword'
                    isError={props.errors.confirmPassword ? true : false}
                    placeholder='Confirm Password'
                    label='Confirm Password'
                    onChange={props.handleChange}
                  />
                </InputFieldItem>
              </form>

              <div className='grow w-full h-14 p-2 rounded justify-start items-start gap-2 flex max-w-[400px]'>
                <div className='w-6 h-6 relative'>
                  <div className='w-4 h-4 left-[3px] top-[3px] absolute rounded-md border-2 border-zinc-800' />
                </div>
                <h5 className="dark:text-gray-200 text-sm font-normal ">
                  I have read and agree to the{' '}
                  <span className='text-black-900 text-sm font-bold '>
                    Terms of Service, Terms of Use{' '}
                  </span>
                  and{' '}
                  <span className='text-grey-900 text-sm font-bold'>
                    Privacy Policy.
                  </span>
                </h5>
              </div>

              <Button
                isLoading={props.isSubmitting}
                className='!bg-blue-700 !max-w-[400px]'
                onClick={props.handleSubmit}
                type='button'
                disabled={
                  Object.keys(props.errors).length > 0 || !props.dirty
                    ? true
                    : false
                }
              >
                <span className="text-white p-2 text-base font-normal ">
                  {' '}
                  Sign Up
                </span>
              </Button>

            </section>
          );
        }}
      </Formik>
    </main>
  );
};

export default Registration;
