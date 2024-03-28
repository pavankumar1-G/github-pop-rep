// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {languages, updateActiveId, isActive} = props
  const {id, language} = languages

  const onClickLanguageItem = () => {
    updateActiveId(id)
  }

  const buttonClassName = isActive ? 'active-language-btn' : 'language-btn'

  return (
    <li className="language-item">
      <button
        className={buttonClassName}
        type="button"
        onClick={onClickLanguageItem}
      >
        {language}
      </button>
    </li>
  )
}
export default LanguageFilterItem
