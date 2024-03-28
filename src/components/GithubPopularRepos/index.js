import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

// Write your code here
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class GithubPopularRepos extends Component {
  state = {
    activeId: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
    repositoriesData: [],
  }

  componentDidMount() {
    this.getRepositoriesData()
  }

  updateActiveId = id => {
    this.setState({activeId: id}, this.getRepositoriesData)
  }

  getRepositoriesData = async () => {
    const {activeId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeId}`
    // const options = {
    //   method: 'GET',
    // }
    const response = await fetch(apiUrl)
    if (response.ok) {
      const responseData = await response.json()
      const updatedData = responseData.popular_repos.map(eachObj => ({
        name: eachObj.name,
        id: eachObj.id,
        issuesCount: eachObj.issues_count,
        forksCount: eachObj.forks_count,
        starsCount: eachObj.stars_count,
        avatarUrl: eachObj.avatar_url,
      }))
      this.setState({
        repositoriesData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderGithubRepositoriesLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderGithubRepositoriesFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Something Went Wrong</h1>
    </div>
  )

  renderGithubRepositoriesListView = () => {
    const {repositoriesData} = this.state

    return (
      <ul className="repositories-list">
        {repositoriesData.map(eachRepository => (
          <RepositoryItem
            key={eachRepository.id}
            repositoryDetails={eachRepository}
          />
        ))}
      </ul>
    )
  }

  renderRepositoryDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderGithubRepositoriesLoadingView()
      case apiStatusConstants.success:
        return this.renderGithubRepositoriesListView()
      case apiStatusConstants.failure:
        return this.renderGithubRepositoriesFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state

    return (
      <div className="github-popular-repos-container">
        <h1 className="heading">Popular</h1>

        <ul className="languages-list">
          {languageFiltersData.map(eachLanguage => (
            <LanguageFilterItem
              key={eachLanguage.id}
              languages={eachLanguage}
              updateActiveId={this.updateActiveId}
              isActive={eachLanguage.id === activeId}
            />
          ))}
        </ul>
        <div className="repository-list-container">
          {this.renderRepositoryDetails()}
        </div>
      </div>
    )
  }
}
export default GithubPopularRepos
