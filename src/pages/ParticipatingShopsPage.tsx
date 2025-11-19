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
import { locationOutline, timeOutline, chevronForwardOutline, closeOutline } from 'ionicons/icons';
import { campaigns } from '../data/campaigns';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const ParticipatingShopsPage: React.FC = () => {
  const history = useHistory();
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaign = campaigns[campaignId];
  const isRoot = useIsRootPage();

  // Handle root page detection for native swipe-back
  useEffect(() => {
    console.log('ParticipatingShopsPage: isRoot =', isRoot);

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

  if (!campaign) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <IonText color="danger">
              <h2>Campaign not found</h2>
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
          <IonTitle style={{ color: 'black', fontWeight: 'bold' }}>Participating Shops</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f5f5f5' }}>
        <div style={{ padding: '16px' }}>
          {/* Campaign Info Banner */}
          <IonCard
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
            }}
          >
            <IonCardContent style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px' }}>{campaign.heroImage}</div>
              <div style={{ flex: 1 }}>
                <IonText color="light">
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>{campaign.title}</h3>
                  <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{campaign.subtitle}</p>
                </IonText>
              </div>
              <IonBadge
                color="light"
                style={{ fontSize: '14px', padding: '6px 12px', fontWeight: 'bold', color: '#FF6B00' }}
              >
                {campaign.points}
              </IonBadge>
            </IonCardContent>
          </IonCard>

          {/* Info Section */}
          <IonText>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
              {campaign.offers.length} Locations Available
            </h2>
            <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>
              Tap any shop to view details and special bonuses
            </p>
          </IonText>

          {/* Shops List */}
          {campaign.offers.map((offer) => (
            <IonCard
              key={offer.id}
              button
              onClick={() => history.push(`/promo/${campaignId}/offers/${offer.id}`)}
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                margin: '0 0 12px 0',
              }}
            >
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                    }}
                  >
                    🏪
                  </div>
                  <div style={{ flex: 1 }}>
                    <IonText>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{offer.name}</h3>
                    </IonText>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <IonIcon icon={locationOutline} style={{ fontSize: '14px', color: '#999' }} />
                      <IonText>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{offer.district}</p>
                      </IonText>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IonIcon icon={timeOutline} style={{ fontSize: '14px', color: '#999' }} />
                      <IonText>
                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{offer.hours.split(',')[0]}</p>
                      </IonText>
                    </div>
                    <IonBadge
                      color="success"
                      style={{ fontSize: '11px', padding: '4px 8px', marginTop: '8px', fontWeight: 'normal' }}
                    >
                      {offer.bonus.substring(0, 30)}...
                    </IonBadge>
                  </div>
                  <IonIcon icon={chevronForwardOutline} style={{ fontSize: '20px', color: '#ccc', marginTop: '16px' }} />
                </div>
              </IonCardContent>
            </IonCard>
          ))}

          {/* Back Button */}
          <IonButton
            expand="block"
            fill="outline"
            color="primary"
            onClick={() => history.goBack()}
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              height: '48px',
              marginTop: '16px',
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

export default ParticipatingShopsPage;
