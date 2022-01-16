/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_REPOS } from 'containers/App/constants';
import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectUsername } from 'containers/HomePage/selectors';

/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
  const username = yield select(makeSelectUsername());
  console.log(username)
  const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;
  console.log("next 1");
  try {
    // Call our request helper (see 'utils/request')
    console.log("next 2");
    const repos = yield call(request, requestURL);
    yield put(reposLoaded(repos, username));
    console.log("next 3");
  } catch (err) {
    yield put(repoLoadingError(err));
    console.log("next 4");
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_REPOS, getRepos);
}
