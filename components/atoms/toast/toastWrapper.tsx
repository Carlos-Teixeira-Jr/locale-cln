// ToastWrapper.tsx
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastWrapperProps extends Omit<ToastContainerProps, 'autoClose'> {
  autoCloseTime?: number;
}

const ToastWrapper: React.FC<ToastWrapperProps> = ({ autoCloseTime = 5000, ...toastContainerProps }) => {
  return (
    <ToastContainer
      autoClose={autoCloseTime}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      {...toastContainerProps}
    />
  );
};

export default ToastWrapper;
