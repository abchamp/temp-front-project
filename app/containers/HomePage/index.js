/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './home.css';
//
import Webcam from 'react-webcam';
const key = 'home';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function HomePage({
  username,
  loading,
  error,
  repos,
  onSubmitForm,
  onChangeUsername,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  // useEffect(() => {
  //   // When initial state username is not null, submit the form to load repos
  //   if (username && username.trim().length > 0) onSubmitForm();
  // }, [num1]);

  const [fontSize, setFontSize] = useState(16);
  //
  let num1 = 0;
  const result = React.useRef('====');
  const calculate = ev => {
    result.current.innerText = `${num1}`;
    num1 += 1;
  };

  const onClickButtonZoomIn = () => {
    const newSize = fontSize + 2;
    setFontSize(newSize);
  };

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  // const getVideo = () => {
  //   navigator.mediaDevices.getUserMedia({
  //     video: { width: 1920, height: 1080 }
  //   }).then(stream => {
  //     let video = videoRef.current;
  //     video.srcObject = stream;
  //     video.play();
  //   }).catch(err => {
  //     console.error(err);
  //   })
  // }

  // useEffect(() => {
  //   getVideo();
  // }, [videoRef]);

  const webcamRef = React.useRef(null);
  // https://stackoverflow.com/questions/52288332/how-to-send-a-jpg-image-to-the-server-with-react-camera
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
  }, [webcamRef]);

  const showLoading = (() => {
    // mapStateToProps({loading: true})
    // this.loading = true;
    onSubmitForm();
  });

  const svgIcon = () => (
    <svg
      width="100%"
      height="100%"
      className="svg"
      viewBox="0 0 260 200"
      // preserveAspectRatio="none"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <mask id="overlay-mask" x="0" y="0" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
          <circle cx="50%" cy="50%" r="70" />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        mask="url(#overlay-mask)"
        fillOpacity="0.7"
      />
    </svg>
  );
  // https://stackoverflow.com/questions/64358059/overlay-transparent-circle-on-webcam-preview-in-a-browser
  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>

      <div className="webcam-container">
        <Webcam
          id="webcam"
          width={windowDimensions.width / 3}
          // height={windowDimensions.height}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <div className="overlay-container">{svgIcon()}</div>
      </div>
      {/* <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      /> */}
      <button onClick={capture}>Capture photo</button>
      <button onClick={showLoading}>Show loading</button>
      {/* <div className="camera">
        <video ref={videoRef}></video>
        <button>SNAP!</button>
      </div>

      <div className={'result' + (hasPhoto ? 'hasPhoto' : '')}>
        <canvas ref={photoRef}></canvas>
        <button>CLOSE!</button>
      </div> */}
    </article>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
