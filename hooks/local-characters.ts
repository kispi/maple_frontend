import { CharacterInfo, SimpleCharacter } from '~/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import helpers from '~/helpers'

const maxLocalCharacters = 12

const simpleCharacter = (character: CharacterInfo): SimpleCharacter =>({
  class: character.basic.character_class,
  level: character.basic.character_level,
  name: character.basic.character_name,
  img: character.basic.character_image,
  world: character.basic.world_name,
  guild: character.basic.character_guild_name,
  expRate: character.basic.character_exp_rate,
  lastUpdated: helpers.dayjs().format('YYYY-MM-DD HH:mm:ss'),
})

const useLocalCharacters = (selectedCharacter?: CharacterInfo) => {
  const [localCharacters, setLocalCharacters] = useState<Record<string, SimpleCharacter>>({})

  const sortedLocalCharacters = useMemo(() => {
    return Object.keys(localCharacters)
      .sort((a, b) => localCharacters[b].lastUpdated.localeCompare(localCharacters[a].lastUpdated))
      .map(key => localCharacters[key])
  }, [localCharacters])

  const loadStoredCharacters = useCallback(() => {
    const stored = helpers.localStorage.getMeta('localCharacters')
    if (!selectedCharacter) {
      setLocalCharacters(stored)
      return
    }

    stored[selectedCharacter.basic.character_name] = simpleCharacter(selectedCharacter)
    if (Object.keys(stored).length > maxLocalCharacters) {
      const oldestCharacter = Object.keys(stored).reduce((a, b) => stored[a].lastUpdated < stored[b].lastUpdated ? a : b)
      delete stored[oldestCharacter]
    }
    helpers.localStorage.setMeta('localCharacters', stored)
    setLocalCharacters(stored)
  }, [selectedCharacter])

  useEffect(
    loadStoredCharacters,
    [selectedCharacter, loadStoredCharacters],
  )

  return { sortedLocalCharacters }
}

export default useLocalCharacters