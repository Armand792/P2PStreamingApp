import { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import { Loader } from '../loader/Loader';

interface IProps {
  icon?: ReactNode | any;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: (event?: React.SyntheticEvent<any> | undefined) => void;
  isLoading?: boolean;
}

const Button = ({
  icon,
  children,
  className,
  disabled = false,
  type,
  onClick,
  isLoading = false,
  ...rest
}: IProps) => {
  return (
    <button
      onClick={disabled ? () => {} : onClick}
      type={type}
      className={classNames(
        'relative inline-flex items-center justify-center p-0.5 m-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800',
        className,
        disabled && '!bg-opacity-50'
      )}
    >
      {icon ?? typeof icon === 'function' ? icon() : icon}
      {children}
      {isLoading && <Loader color='white' />}
    </button>
  );
};

export default Button;
