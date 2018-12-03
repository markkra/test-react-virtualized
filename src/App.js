import React from 'react';
import deepFreeze from 'deep-freeze';
import Lister from './lister';

const FETCH_SIZE = 12;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listItems: deepFreeze(this.createMockData(100000)),
      list: [],
      hasMore: false,
      isLoading: false
    };

    this.createMockData = this.createMockData.bind(this);
    this.getPage = this.getPage.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  render() {
    return (
      <Lister
        list={this.state.list}
        hasMore={this.state.hasMore}
        isNextPageLoading={this.state.isLoading}
        loadNextPage={this.loadNextPage}
      />
    );
  }

  componentDidMount() {
    this.getPage(0, FETCH_SIZE).then(data =>
      this.setState({
        list: data.list,
        hasMore: data.hasMore,
        nextIndex: data.nextIndex,
        isLoading: false
      })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevState);
    // console.log(this.state);
  }

  loadNextPage() {
    if (this.state.hasMore) {
      this.getPage(this.state.nextIndex, this.state.nextIndex + FETCH_SIZE).then(data =>
        this.setState({
          list: [...this.state.list, ...data.list],
          hasMore: data.hasMore,
          nextIndex: data.nextIndex,
          isLoading: false
        })
      );
    }
  }

  getPage(start, end) {
    console.log(`Loading rows ${start} to ${end}`);
    this.setState({ isLoading: true });
    return new Promise(resolve => {
      const results = {
        list: this.state.listItems.slice(start, end),
        hasMore: end < this.state.listItems.length,
        nextIndex: end
      };
      setTimeout(() => {
        resolve(results);
      }, 300);
    });
  }

  createMockData(countItems) {
    const listItems = [];
    for (let i = 0; i < countItems; i++) {
      listItems.push(`Row ${i}`);
    }
    return listItems;
  }
}

export default App;
