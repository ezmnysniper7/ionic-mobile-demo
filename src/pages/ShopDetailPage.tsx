import React, { useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButtons,
  IonBadge,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { locationOutline, timeOutline, giftOutline, closeOutline, arrowBackOutline } from 'ionicons/icons';
import { campaigns } from '../data/campaigns';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const ShopDetailPage: React.FC = () => {
  const history = useHistory();
  const { campaignId, offerId } = useParams<{ campaignId: string; offerId: string }>();
  const campaign = campaigns[campaignId];
  const offer = campaign?.offers.find((o) => o.id === offerId);
  const isRoot = useIsRootPage();

  // Handle root page detection for native swipe-back
  useEffect(() => {
    console.log('ShopDetailPage: isRoot =', isRoot);

    if (isRoot) {
      // Enable native swipe back when on root page
      NativeBridge.enableSwipeBack?.();
    } else {
      // Disable native swipe back when not on root
      NativeBridge.disableSwipeBack?.();
    }
  }, [isRoot]);

  const handleClose = () => {
    NativeBridge.closeWebview();
  };

  if (!campaign || !offer) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <IonText color="danger">
              <h2>Shop not found</h2>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)' }}>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={handleClose}>
              <IonIcon icon={closeOutline} style={{ fontSize: '28px', color: 'black' }} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ color: 'black', fontWeight: 'bold' }}>Shop Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f5f5f5' }}>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏪</div>
          <IonText color="light">
            <h1 style={{ fontSize: '26px', margin: '0 0 8px 0', fontWeight: 'bold' }}>{offer.name}</h1>
            <p style={{ fontSize: '15px', margin: '0', opacity: 0.9 }}>{offer.district}</p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Campaign Badge */}
          <IonCard
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              margin: '0 0 16px 0',
            }}
          >
            <IonCardContent style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>{campaign.heroImage}</div>
              <div style={{ flex: 1 }}>
                <IonText>
                  <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#999' }}>Part of</p>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{campaign.title}</h3>
                </IonText>
              </div>
              <IonBadge color="primary" style={{ fontSize: '13px', padding: '6px 10px', fontWeight: 'bold' }}>
                {campaign.points}
              </IonBadge>
            </IonCardContent>
          </IonCard>

          {/* Location Info */}
          <IonCard
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              margin: '0 0 16px 0',
            }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>Location</h3>
              </IonText>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <IonIcon icon={locationOutline} style={{ fontSize: '24px', color: 'var(--ion-color-primary)', marginTop: '2px' }} />
                <div>
                  <IonText>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#999' }}>Address</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', lineHeight: '1.5' }}>{offer.address}</p>
                  </IonText>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <IonIcon icon={timeOutline} style={{ fontSize: '24px', color: 'var(--ion-color-primary)', marginTop: '2px' }} />
                <div>
                  <IonText>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#999' }}>Opening Hours</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', lineHeight: '1.5' }}>{offer.hours}</p>
                  </IonText>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Special Bonus */}
          <IonCard
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #2dd36f 0%, #28ba62 100%)',
            }}
          >
            <IonCardContent style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <IonIcon icon={giftOutline} style={{ fontSize: '40px', color: 'white', flexShrink: 0 }} />
              <div>
                <IonText color="light">
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>Special Bonus</h3>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', opacity: 0.95 }}>{offer.bonus}</p>
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>

          {/* How to Redeem */}
          <IonCard
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              margin: '0 0 16px 0',
            }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>How to Redeem</h3>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666', lineHeight: '2' }}>
                  <li>Visit this participating shop</li>
                  <li>Make a qualifying purchase</li>
                  <li>Pay with your registered Octopus card</li>
                  <li>Bonus points will be credited within 3 business days</li>
                </ol>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Action Buttons */}
          <IonButton
            expand="block"
            fill="outline"
            color="primary"
            onClick={() => history.push(`/promo/${campaignId}/offers`)}
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              height: '48px',
              marginBottom: '12px',
            }}
          >
            <IonIcon icon={arrowBackOutline} slot="start" />
            Back to Offers
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            color="medium"
            onClick={() => history.push(`/promo/${campaignId}`)}
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              height: '48px',
            }}
          >
            Back to Campaign
          </IonButton>

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ShopDetailPage;
