import React, { memo } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import GoogleMapReact from 'google-map-react';

import {
    makeSelectRepos,
    makeSelectLoading,
    makeSelectError,
} from 'containers/App/selectors';


// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';

export function LocationMapPage({
    username,
    loading,
    error,
    repos,
}) {
    // useInjectReducer({key , reduc})
    // user
    let defaultValue = {
        center: {
            lat: 13.2829164,
            lng: 100.9212115
        },
        zoom: 15
    }
    const AnyReactComponent = ({ text }) => <div>{text}</div>;

    return (
        <article>
            <Helmet>
                <title>Location Map Page</title>
                <meta
                    name="location map page"
                    content="test"
                />
            </Helmet>
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: '' }}
                    defaultCenter={defaultValue.center}
                    defaultZoom={defaultValue.zoom}
                >
                    <AnyReactComponent
                        lat={13.2829164}
                        lng={100.9212115}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>

        </article>
    )
}

LocationMapPage.PropTypes = {
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
}

const mapStateToProps = createStructuredSelector({
    repos: makeSelectRepos(),
    loading: makeSelectLoading(),
    error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(LocationMapPage);