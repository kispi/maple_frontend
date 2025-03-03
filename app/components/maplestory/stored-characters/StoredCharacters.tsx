import { CharacterInfo, DefaultError, SimpleCharacter } from '~/types'
import { useSearchParams } from '@remix-run/react'
import useLocalCharacters from 'hooks/local-characters'
import useMapleStore from '~/store/maple'
import ExpBar from '../exp-bar/ExpBar'
import BadgeGlass from '~/components/common/badge-glass/BadgeGlass'
import helpers from '~/helpers'
import './stored-characters.scss'

const hoursAgo = (date: string) => {
  const secDiff = helpers.dayjs().diff(helpers.dayjs(date), 'second')
  if (secDiff < 60) return `${secDiff}초 전`

  const diff = Math.floor(secDiff / 60)
  if (diff < 60) return `${diff}분 전`

  if (diff < 60 * 24) return `${helpers.dayjs().diff(helpers.dayjs(date), 'hour')}시간 전`

  if (diff < 60 * 24 * 30) return `${helpers.dayjs().diff(helpers.dayjs(date), 'day')}일 전`

  return `${helpers.dayjs().diff(helpers.dayjs(date), 'month')}개월 전`
}

const LastStored = ({ lastUpdated }: { lastUpdated: string }) => {
  return <span className="last-stored m-l-4">({hoursAgo(lastUpdated)})</span>
}

const StoredCharacters = ({
  selectedCharacter,
}: {
  selectedCharacter?: CharacterInfo,
}) => {
  const { sortedLocalCharacters, removeCharacter } = useLocalCharacters(selectedCharacter)

  const { loadCharacter } = useMapleStore()

  const [, setSearchParams] = useSearchParams()

  const onClickCharacter = async (character: SimpleCharacter) => {
    // 프론트엔드가 업데이트 된 경우 초기화
    if (!character.name) {
      helpers.localStorage.setMeta('localCharacters', {})
      return
    }

    try {
      await loadCharacter(character.name)
      setSearchParams({ name: character.name })
    } catch (e) {
      const error = e as DefaultError
      helpers.toast.error(error.code === '0001' ? error.data.message : helpers.$t('ERROR_FAILED'))
    }
  }

  const onClickRemove = (character: SimpleCharacter, e: React.MouseEvent) => {
    e.stopPropagation()
    removeCharacter(character)
  }

  return !selectedCharacter ? <div className="stored-characters">
    {sortedLocalCharacters.length > 0 ? <div className="grid">
      {sortedLocalCharacters.map((character, index) => (
        <div
          onClick={() => onClickCharacter(character)}
          key={index}
          className="stored-character">
          <i
            onClick={(e) => onClickRemove(character, e)}
            className="fa fa-times"
          />
          <div className="flex-row align-center g-16">
            <img src={character.img} alt={character.class} />
            <div className="flex g-4">
              <div>
                {character.name}<LastStored lastUpdated={character.lastUpdated} />
              </div>
              <div>
                <span className="c-unique f-700">Lv.{character.level}</span> <span>{character.class}</span>
              </div>
              <BadgeGlass className="fit-content">
                <>
                  <img
                    src={helpers.withCdn(`images/${helpers.logic.getWorld(character.world)?.img}`)}
                    alt={character.world}
                    style={ { width: '16px', height: '16px' } }
                  />{character.world}
                  {character.guild ? `@${character.guild}` : ''}
                </>
              </BadgeGlass>
            </div>
          </div>
          <ExpBar expRate={character.expRate} level={character.level} simple={true} />
        </div>
      ))}
    </div> :
    <div className="empty">
      <img src="https://i.namu.wiki/i/sFni-WAntaZThLexfyyAeGB7c0NCgYfT1RloEbwPEA_uONbAseXC_5xGTR9WxNv2I6eCQq_mh5mIUnEOUKvHrQ.webp" alt="maplestory hero" />
      <h1>
        EVERY<span className="c-danger">M</span>APLE,<br/>
      </h1>
      <div>Maplestory Everyday!</div>
    </div>}
  </div> : null
}

export default StoredCharacters