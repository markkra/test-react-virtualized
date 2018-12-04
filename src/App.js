import React from 'react';
import deepFreeze from 'deep-freeze';
import loremIpsum from 'lorem-ipsum';

import Lister from './lister';

const FETCH_SIZE = 24;
const MOCK_DATA_SIZE = 1000;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listItems: deepFreeze(this.createMockData(MOCK_DATA_SIZE)),
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
      <div className="container">
        <Lister
          list={this.state.list}
          hasMore={this.state.hasMore}
          isNextPageLoading={this.state.isLoading}
          loadNextPage={this.loadNextPage}
        />
      </div>
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
    if (this.state.hasMore && !this.state.isLoading) {
      this.getPage(this.state.nextIndex, this.state.nextIndex + FETCH_SIZE).then(data => {
        const { nextIndex, hasMore, list } = data;

        console.log(`Setting state: nextIndex ${nextIndex}, hasMore ${hasMore}`);
        this.setState({
          list: [...this.state.list, ...list],
          hasMore: hasMore,
          nextIndex: nextIndex,
          isLoading: false
        });
      });
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
    return Array(countItems)
      .fill()
      .map((val, idx) => {
        return {
          name: `Row ${idx}`,
          text: loremIpsum({
            count: 1,
            units: 'sentences',
            sentenceLowerBound: 4,
            sentenceUpperBound: 8
          })
        };
      });
    // for (let i = 0; i < countItems; i++) {
    //   listItems.push(`Row ${i}`);
    // }
    // return listItems;
  }
}

export default App;
