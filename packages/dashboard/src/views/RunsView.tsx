import { navStructure } from '@src/lib/navigation';
import { Button } from 'bold-ui';
import React, { useLayoutEffect } from 'react';
import { RunSummary } from '../components/run/summary';
import { useGetRunsFeedQuery } from '../generated/graphql';

export function RunsView() {
  useLayoutEffect(() => {
    navStructure([]);
  }, []);
  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      cursor: '',
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) {
    return <p>No data</p>;
  }

  const runFeed = data.runFeed;

  function loadMore() {
    return fetchMore({
      variables: {
        cursor: runFeed.cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          runFeed: {
            __typename: prev.runFeed.__typename,
            hasMore: fetchMoreResult!.runFeed.hasMore,
            cursor: fetchMoreResult!.runFeed.cursor,
            runs: [...prev.runFeed.runs, ...fetchMoreResult!.runFeed.runs],
          },
        };
      },
    });
  }

  if (!runFeed.runs.length) {
    return (
      <div>
        Welcome to Sorry Cypress! Your tests runs will appears here.{' '}
        <a
          href="https://github.com/agoldis/sorry-cypress"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
      </div>
    );
  }
  return (
    <>
      {runFeed.runs.map((run) => (
        <RunSummary run={run} key={run.runId} />
      ))}
      {runFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
}
