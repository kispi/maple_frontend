import { useState } from 'react'
import { CharacterInfo } from '~/types'
import { CharacterContentsExp } from '~/components/maplestory/character-contents-exp/CharacterContentsExp'
import { CharacterItemEquipment } from '~/components/maplestory/character-item-equipment/CharacterItemEquipment'
import { CharacterStat } from '~/components/maplestory/character-stat/CharacterStat'
import { CharacterSkills } from '~/components/maplestory/character-skills/CharacterSkills'
import helpers from '~/helpers'
import './sub-pages.scss'

const SubPages = ({ character }: { character: CharacterInfo }) => {
  const tabs = ['EXP_CONTENTS', 'EQUIPMENTS', 'STATS', 'SKILLS']

  const [selectedTab, setSelectedTab] = useState(tabs[0])

  return <div className="card sub-pages">
    <div className="tabs">
      {tabs.map((t, index) => <div
        key={index}
        onClick={() => setSelectedTab(t)}
        className={`tab ${selectedTab === t ? 'selected' : ''}`}>
        {helpers.$t(t)}
      </div>)}
      <div className="tab empty">EMPTY</div>
    </div>
    {selectedTab === 'EXP_CONTENTS' && <CharacterContentsExp character={character} />}
    {selectedTab === 'EQUIPMENTS' && <CharacterItemEquipment character={character} />}
    {selectedTab === 'STATS' && <CharacterStat character={character} />}
    {selectedTab === 'SKILLS' && <CharacterSkills character={character} />}
  </div>
}

export default SubPages