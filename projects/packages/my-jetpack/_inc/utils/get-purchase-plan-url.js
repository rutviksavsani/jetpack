// eslint-disable-next-line no-unused-vars
/* global myJetpackInitialState */

import { getRedirectUrl } from '@automattic/jetpack-components';
import { MY_JETPACK_MY_PLANS_PURCHASE_SOURCE } from '../constants';

/**
 * Return the redurect URL for purchasing a plan, according to the Jetpack redurects source.
 *
 * @returns {string}            the redirect URL
 */
export default function () {
	const site = window?.myJetpackInitialState?.siteSuffix;
	const blogID = window?.myJetpackInitialState?.blogID;
	const query = window?.myJetpackInitialState?.myJetpackCheckoutUri
		? `redirect_to=${ window?.myJetpackInitialState?.myJetpackCheckoutUri }`
		: null;
	return getRedirectUrl( MY_JETPACK_MY_PLANS_PURCHASE_SOURCE, { site: blogID ?? site, query } );
}
