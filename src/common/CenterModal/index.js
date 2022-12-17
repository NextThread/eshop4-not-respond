import { createPortal } from 'react-dom';

import Backdrop from 'common/Backdrop';

import styles from './index.module.scss';

const CenterModal = ({ children, toggleModal }) => {
  const backdropElement = document.getElementById('backdrop');
  const overlaysElement = document.getElementById('overlays');

  return (
    <>
      {createPortal(<Backdrop toggleModal={toggleModal} />, backdropElement)}
      {createPortal(
        <div className={styles.modal}>{children}</div>,
        overlaysElement
      )}
    </>
  );
};

export default CenterModal;