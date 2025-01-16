import { useEffect, useRef, useState } from 'react'
import helpers from '~/helpers'
import useAppStore, { Modal } from '~/store/app'

const AppModal = ({ modal }: { modal: Modal }) => {
  const ModalComponent = modal.component

  const refModal = useRef<HTMLDivElement>(null)

  const [show, setShow] = useState(false)

  const store = useAppStore()

  const closeOnMouseDownBackdrop = () => onClose()

  const onClose = (e?: Event) => {
    if (modal.resolve) modal.resolve(e)

    setShow(false)
    setTimeout(() => store.removeModal(modal), 200) // 200ms is the duration of the modal transition
  }

  useEffect(() => {
    if (refModal.current) {
      const targetModal = refModal.current.querySelector('.modal-base-style') as HTMLElement
      if (targetModal) helpers.modal.center(targetModal)
    }

    setShow(true)
  }, [])

  return <div
    ref={refModal}
    className={`app-modal ${show ? 'opened' : ''}`}>
    <div className="modal-fixed-container">
      <div
        onMouseDown={closeOnMouseDownBackdrop}
        className="modal-backdrop"
      />
      <ModalComponent options={modal.options} onClose={onClose}/>
    </div>
  </div>
}

export default AppModal