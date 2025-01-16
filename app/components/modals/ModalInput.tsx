import { useEffect, useRef, useState } from 'react'
import ModalHeader from './ModalHeader'
import helpers from '~/helpers'

const ModalInput = ({
  options,
  onClose,
}: {
  options: {
    title?: string,
    body?: string,
    type? :string,
    placeholder?: string,
    autocomplete?: string,
  },
  onClose: (e?: unknown) => void,
}) => {
  const refModalInput = useRef<HTMLInputElement>(null)

  const [inputValue, setInputValue] = useState('')

  const buttons = [{
    text: 'CANCEL',
    class: 'btn-default',
    handler: () => onClose(),
  }, {
    text: 'CONFIRM',
    class: 'btn-primary',
    handler: () => onClose(inputValue),
  }]

  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setInputValue((e.target as HTMLInputElement).value)
      if (e.key === 'Enter') {
        onClose((e.target as HTMLInputElement).value)
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      if (refModalInput.current) {
        refModalInput.current.focus()
      }
    }, 100)
  })

  return <div className="modal-input modal-base-style">
    <ModalHeader title={options.title} onClose={() => onClose()}/>
    <form className="p-16" onSubmit={e => e.preventDefault()}>
      <input
        ref={refModalInput}
        type={options.type || 'text'}
        placeholder={helpers.$t(options.placeholder)}
        autoComplete={options.autocomplete}
        onKeyDown={onKeydown}
      />
    </form>
    <div className="bottom-buttons">{
      buttons.map((btn, idx) =>
      <button
        key={idx}
        className={`btn ${btn.class}`}
        onClick={() => btn.handler()}>
        {helpers.$t(btn.text)}
      </button>
    )}</div>
  </div>
}

export default ModalInput