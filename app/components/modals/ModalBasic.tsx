import ModalHeader from './ModalHeader'

const ModalBasic = ({
  options,
  onClose,
}: {
  options: {
    title?: string,
    body?: string,
    buttons?: [{
      text: string,
      class: string,
    }],
  },
  onClose: (e?: unknown) => void,
}) => <div className="modal-basic modal-base-style">
  <ModalHeader title={options.title} onClose={() => onClose()}/>
  {options.body && <div className="body" dangerouslySetInnerHTML={{ __html: options.body }}></div>}
  {options.buttons && <div className="bottom-buttons">{
    options.buttons.map((btn, idx) =>
    <button
      key={idx}
      className={`btn ${btn.class}`}
      onClick={() => onClose(idx)}>
      {btn.text}
    </button>
  )}</div>}
</div>

export default ModalBasic