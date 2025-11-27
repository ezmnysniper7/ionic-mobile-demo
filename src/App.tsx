import React from 'react';
import { IonApp, IonRouterOutlet, getPlatforms } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import CampaignLandingPage from './pages/CampaignLandingPage';
import ParticipatingShopsPage from './pages/ParticipatingShopsPage';
import ShopDetailPage from './pages/ShopDetailPage';
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
          {/* Level 1: Campaign Landing */}
          <Route exact path="/promo/:campaignId" component={CampaignLandingPage} />

          {/* Level 2: Participating Shops */}
          <Route exact path="/promo/:campaignId/offers" component={ParticipatingShopsPage} />

          {/* Level 3: Shop Detail */}
          <Route exact path="/promo/:campaignId/offers/:offerId" component={ShopDetailPage} />

          {/* Default redirect for testing */}
          <Redirect exact from="/" to="/promo/coffee-frenzy" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
