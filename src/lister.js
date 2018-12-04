import React from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';

import 'react-virtualized/styles.css'; // only needs to be imported once
import './lister.styles.css';

function LoadingPlaceholder({ items }) {
  return (
    <>
      <div className="content-placeholder-text">
        <span className="content-placeholder-background" />
      </div>
      <div className="content-placeholder-text">
        <span className="content-placeholder-background" />
      </div>
    </>
  );
}

function Lister({ list, hasMore, isNextPageLoading, loadNextPage }) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const rowCount = hasMore ? list.length + 1 : list.length;

  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => {
    return index < list.length;
  };

  function rowRenderer({
    index, // Index of row
    key, // Unique key within array of rendered rows
    style // Style object to be applied to row (to position it);
  }) {
    const item = list[index];

    if (!item) {
      return (
        <div key={key} style={style}>
          <LoadingPlaceholder />
        </div>
      );
    }

    return (
      <div key={key} style={style}>
        <div className="row">
          <div>{item.name}</div>
          <div>{item.text}</div>
        </div>
      </div>
    );
  }

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
      minimumBatchSize={24}
      threshold={1}
    >
      {({ onRowsRendered, registerChild }) => (
        <div className="List">
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                height={height}
                rowCount={rowCount}
                rowHeight={60}
                rowRenderer={rowRenderer}
                width={width}
                overscanRowCount={3}
              />
            )}
          </AutoSizer>
        </div>
      )}
    </InfiniteLoader>
  );
}

export { Lister };
export default Lister;
