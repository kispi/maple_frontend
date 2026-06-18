import helpers from '~/helpers'
import { useSearchCharacter } from './useSearchCharacter'
import './search-character.scss'

const SearchCharacter = () => {
  const { characterName, setCharacterName, setIsComposing, onSearch, refInput } = useSearchCharacter()

  return (
    <div className="search-character input-wrapper">
      <i onClick={onSearch} className="far fa-search cursor-pointer" />
      <input
        ref={refInput}
        type="text"
        placeholder={helpers.$t('PLACEHOLDER_SEARCH_CHARACTER')}
        value={characterName}
        maxLength={12}
        onChange={e => setCharacterName(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') onSearch()
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
      />
      {characterName && (
        <i
          className="far fa-times cursor-pointer"
          onClick={() => {
            setCharacterName('')
            if (refInput.current) refInput.current.focus()
          }}
        />
      )}
    </div>
  )
}

export default SearchCharacter