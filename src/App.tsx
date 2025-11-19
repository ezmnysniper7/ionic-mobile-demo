import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import CampaignLandingPage from './pages/CampaignLandingPage';
import ParticipatingShopsPage from './pages/ParticipatingShopsPage';
import ShopDetailPage from './pages/ShopDetailPage';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
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
