import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  message?: string;
  isError?: boolean;
}

const InputFieldItem = ({ children, message, isError = false }: IProps) => {
  return (
    <div className='mb-[1rem]'>
      <div>{children}</div>
      {isError && (
        <span className="text-red-600 text-xs font-light font-['Poppins']">
          {message}
        </span>
      )}
    </div>
  );
};

export default InputFieldItem;
