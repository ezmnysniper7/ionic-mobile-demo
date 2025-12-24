import React from 'react';
import { IonApp, IonRouterOutlet, getPlatforms } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

// Old campaign pages (kept for reference)
import CampaignLandingPage from './pages/CampaignLandingPage';
import ParticipatingShopsPage from './pages/ParticipatingShopsPage';
import ShopDetailPage from './pages/ShopDetailPage';

// New AEM-integrated pages
import HomePage from './pages/HomePage';
import MerchantListingPage from './pages/MerchantListingPage';
import MerchantDetailPage from './pages/MerchantDetailPage';
import EStampPage from './pages/EStampPage';
import CouponListPage from './pages/CouponListPage';
import CouponDetailPage from './pages/CouponDetailPage';
import CampaignPage from './pages/CampaignPage';
import MissionPage from './pages/MissionPage';
import ReferAFriendPage from './pages/ReferAFriendPage';

import { mdTransitionAnimation } from './animations/androidAnimations';

const App: React.FC = () => {
  // Detect if running on Android to use Android animations
  const platforms = getPlatforms();

  // Check if AndroidInterface exists (means we're in native Android WebView)
  const hasAndroidInterface = typeof (window as any).AndroidInterface !== 'undefined';

  // Check user agent for Android
  const userAgentHasAndroid = /android/i.test(navigator.userAgent);

  const isAndroid = platforms.includes('android') || hasAndroidInterface || userAgentHasAndroid;

  // Use Android animation on Android devices, default iOS animation on others
  const routerAnimation = isAndroid ? mdTransitionAnimation : undefined;

  console.log('Platform detection:', { platforms, hasAndroidInterface, userAgentHasAndroid, isAndroid });

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet animation={routerAnimation}>
          {/* New AEM-integrated routes */}
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/merchants" component={MerchantListingPage} />
          <Route exact path="/merchants/:merchantId" component={MerchantDetailPage} />
          <Route exact path="/estamp" component={EStampPage} />
          <Route exact path="/coupons" component={CouponListPage} />
          <Route exact path="/coupons/:couponId" component={CouponDetailPage} />
          <Route exact path="/campaigns" component={CampaignPage} />
          <Route exact path="/missions" component={MissionPage} />
          <Route exact path="/refer" component={ReferAFriendPage} />

          {/* Old campaign routes (kept for reference) */}
          <Route exact path="/promo/:campaignId" component={CampaignLandingPage} />
          <Route exact path="/promo/:campaignId/offers" component={ParticipatingShopsPage} />
          <Route exact path="/promo/:campaignId/offers/:offerId" component={ShopDetailPage} />

          {/* Default redirect to new homepage */}
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
