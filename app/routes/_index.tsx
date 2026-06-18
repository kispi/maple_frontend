import useAppStore from '~/store/app'
import SearchCharacter from '~/components/maplestory/search-character/SearchCharacter'
import StoredCharacters from '~/components/maplestory/stored-characters/StoredCharacters'

const Index = () => {
  const { isMobile } = useAppStore()

  // SearchCharacter에서 따로 $http 요청하지 말고, url이 바뀌면 loader가 자동 호출되는 것을 이용해서 그냥 그 데이터를 쓰는 형태로 바꿔야 할 듯
  return (
    <div className={`view-main flex g-${isMobile ? 16 : 24}`}>
      <SearchCharacter />
      <StoredCharacters />
    </div>
  )
}

export default Index