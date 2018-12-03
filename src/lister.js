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
    </>
  );
}

function Lister({ list, hasMore, isNextPageLoading, loadNextPage }) {
  const rowCount = (list && list.length) || 0;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = hasMore ? (isNextPageLoading ? () => {} : loadNextPage) : () => {};

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => !hasMore || index < list.size;

  function rowRenderer({
    index, // Index of row
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    key, // Unique key within array of rendered rows
    parent, // Reference to the parent List (instance)
    style // Style object to be applied to row (to position it);
    // This must be passed through to the rendered row element.
  }) {
    const conversationItem = list[index];

    // If row content is complex, consider rendering a light-weight placeholder while scrolling.
    const content = isScrolling ? (
      <div className="row">
        <LoadingPlaceholder />
      </div>
    ) : (
      <div className="row">{conversationItem}</div>
    );

    // Style is required since it specifies how the row is to be sized and positioned.
    // React Virtualized depends on this sizing/positioning for proper scrolling behavior.
    // By default, the List component provides following style properties:
    //    position
    //    left
    //    top
    //    height
    //    width
    // You can add additional class names or style properties as you would like.
    // Key is also required by React to more efficiently manage the array of rows.
    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  }

  return (
    <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
      {({ onRowsRendered, registerChild }) => (
        <div className="List">
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                height={height}
                rowCount={rowCount}
                rowHeight={40}
                rowRenderer={rowRenderer}
                width={width}
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
