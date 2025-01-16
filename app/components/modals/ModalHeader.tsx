const ModalHeader = ({
  title,
  onClose,
  onBack,
}: {
  title?: string,
  onClose?: () => void,
  onBack?: () => void,
}) => <>
  <div className="modal-header">
    <div
      onClick={onBack}
      className={`modal-function-container center ${onBack ? '' : 'o-0 no-touch'}`}>
      <i className="far fa-chevron-left"/>
    </div>
    <div className="modal-title">{title}</div>
    <div
      onClick={onClose}
      className="modal-function-container center">
      <i className="far fa-times"/>
    </div>
  </div>
</>

export default ModalHeader