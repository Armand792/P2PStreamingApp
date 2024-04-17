import { ReactNode, useEffect, useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { FaRegEye } from 'react-icons/fa6';

interface IProps {
  placeholder?: string;
  errorLabel?: string;
  isError?: boolean;
  label?: string;
  name?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  affixIcon?: ReactNode | any;
  suffixIcon?: ReactNode | any;
}

const Input = ({
  placeholder,
  label,
  isError,
  name,
  onChange,
  type,
  affixIcon,
  suffixIcon,
}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [customType, setCustomType] = useState(type);

  const passwordShow = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (showPassword && type === 'password') {
      setCustomType('text');
    } else {
      setCustomType(type);
    }
  }, [showPassword]);

  return (
    <div className='max-w-96 w-full h-16 py-[8px] px-[1rem] bg-white rounded-lg border border-zinc-500 flex-col justify-start items-start inline-flex gap-[0.3rem] hover:border-blue-700'>
      {isError && (
        <span className="text-red-600 text-xs font-medium leading-3 tracking-tight">
          {label} *
        </span>
      )}
      <div
        className={`w-full  ${
          isError ? 'h-[28px]' : 'h-full'
        } flex items-center gap-[0.2rem]`}
      >
        {affixIcon && typeof affixIcon === 'function' ? affixIcon() : affixIcon}
        <input
          type={customType}
          onChange={onChange}
          name={name}
          className={`w-full h-full appearance-none outline-0 max-h-full text-zinc-800 placeholder:text-zinc-500 text-sm font-normal `}
          placeholder={placeholder}
        />
        {type === 'password' ? (
          showPassword ? (
            <FaRegEye onClick={passwordShow} className='cursor-pointer' />
          ) : (
            <FaRegEyeSlash onClick={passwordShow} className='cursor-pointer' />
          )
        ) : (
          <span>
            {suffixIcon && typeof suffixIcon === 'function'
              ? suffixIcon()
              : suffixIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
