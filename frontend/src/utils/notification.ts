import {
  Store,
  NOTIFICATION_TYPE,
  NOTIFICATION_CONTAINER,
} from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

interface IPayload {
  title: string;
  message: string;
  type?: NOTIFICATION_TYPE | undefined;
  duration?: number;
  position?: NOTIFICATION_CONTAINER;
}

const notification = ({
  title,
  message,
  type,
  duration,
  position,
}: IPayload) => {
  Store.addNotification({
    title: title,
    message: message,
    type: type || 'success',
    insert: 'top',
    container: position || 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: duration || 20000, // two minutes
      onScreen: false,
    },
  });
};

export default notification;
