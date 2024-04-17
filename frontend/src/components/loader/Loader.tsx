import { Oval } from 'react-loader-spinner';

interface IProps {
  height?: number;
  width?: number;
  color?: string;
}

export const Loader = ({
  height = 20,
  width = 20,
  color = 'white',
}: IProps) => {
  return (
    <Oval
      height={`${height}`}
      width={`${width}`}
      color={`${color}`}
      wrapperStyle={{}}
      wrapperClass=''
      visible={true}
      ariaLabel='circles-with-bar-loading'
    />
  );
};
