import { getRedirectUrl, UpsellBanner } from '@automattic/jetpack-components';
import { __ } from '@wordpress/i18n';
import analytics from 'lib/analytics';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import jetpackManageIcon from './jetpack-manage.svg';

const JetpackManageBanner = props => {
	const trackEvent = useCallback(
		target => {
			analytics.tracks.recordJetpackClick( {
				target: target,
				feature: 'manage',
				page: props.path,
			} );
		},
		[ props.path ]
	);

	const handleLearnMoreClick = useCallback( () => {
		trackEvent( 'jp-manage-learn-more-click' );
	}, [ trackEvent ] );

	const handleManageSitesClick = useCallback( () => {
		trackEvent( 'jp-manage-dashboard-sites-click' );
	}, [ trackEvent ] );

	const handleSignUpForFreeClick = useCallback( () => {
		trackEvent( 'jp-manage-sign-up-click' );
	}, [ trackEvent ] );

	// Set up the secondary CTA
	const ctaLearnMoreLabel = __( 'Learn more', 'jetpack' );
	const ctaLearnMoreUrl = getRedirectUrl( 'jetpack-at-a-glance-to-jetpack-manage-learn-more' );

	// Set up the primary CTA
	let primaryCtaLabel, primaryCtaURL, primaryCtaOnClick;

	if ( props.isAgencyAccount ) {
		primaryCtaLabel = __( 'Manage sites', 'jetpack' );
		primaryCtaURL = getRedirectUrl( 'jetpack-at-a-glance-to-jetpack-manage-dashboard' );
		primaryCtaOnClick = handleManageSitesClick;
	} else {
		primaryCtaLabel = __( 'Sign up for free', 'jetpack' );
		primaryCtaURL = getRedirectUrl( 'jetpack-at-a-glance-to-jetpack-manage-sign-up' );
		primaryCtaOnClick = handleSignUpForFreeClick;
	}

	return (
		<UpsellBanner
			icon={ jetpackManageIcon }
			title={ __( "Manage your clients' sites with ease", 'jetpack' ) }
			description={ __(
				'Jetpack Manage has the tools you need to manage multiple WordPress sites. Monitor site security, performance, and traffic, and get alerted if a site needs attention. Plus, get bulk discounts.',
				'jetpack'
			) }
			secondaryCtaLabel={ ctaLearnMoreLabel }
			secondaryCtaURL={ ctaLearnMoreUrl }
			secondaryCtaIsExternalLink={ true }
			secondaryCtaOnClick={ handleLearnMoreClick }
			primaryCtaLabel={ primaryCtaLabel }
			primaryCtaURL={ primaryCtaURL }
			primaryCtaIsExternalLink={ true }
			primaryCtaOnClick={ primaryCtaOnClick }
		/>
	);
};

JetpackManageBanner.propTypes = {
	path: PropTypes.string,
	isUserLinked: PropTypes.bool,
	isOwner: PropTypes.bool,
	isFetchingData: PropTypes.bool,
	isAgencyAccount: PropTypes.bool,
};

JetpackManageBanner.defaultProps = {
	path: '',
	isUserLinked: false,
	isOwner: false,
	isFetchingData: false,
	isAgencyAccount: false,
};

export default JetpackManageBanner;
