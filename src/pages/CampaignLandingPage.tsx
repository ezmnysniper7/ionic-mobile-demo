import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonText,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonIcon,
  IonBadge,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { checkmarkCircleOutline, closeOutline, arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { campaigns } from '../data/campaigns';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const CampaignLandingPage: React.FC = () => {
  const history = useHistory();
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaign = campaigns[campaignId];
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const isRoot = useIsRootPage();

  // Handle root page detection for native swipe-back
  useEffect(() => {
    console.log('CampaignLandingPage: isRoot =', isRoot);

    if (isRoot) {
      // Enable native swipe back when on root page (level 1)
      NativeBridge.enableSwipeBack?.();
    } else {
      // Disable native swipe back when not on root (level 2, 3, etc.)
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
          <IonTitle style={{ color: 'black', fontWeight: 'bold' }}>{campaign.title}</IonTitle>
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
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>{campaign.heroImage}</div>
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>{campaign.title}</h1>
            <p style={{ fontSize: '16px', margin: '0 0 16px 0', opacity: 0.9 }}>{campaign.subtitle}</p>
          </IonText>
          <IonBadge
            color="light"
            style={{ fontSize: '18px', padding: '10px 20px', fontWeight: 'bold', color: '#FF6B00' }}
          >
            {campaign.points}
          </IonBadge>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Description Card */}
          <IonCard style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}>
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <p style={{ margin: 0, fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                  {campaign.description}
                </p>
              </IonText>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <IonIcon icon={timeOutline} style={{ fontSize: '20px', color: 'var(--ion-color-primary)' }} />
                <IonText>
                  <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>
                    Valid until: <strong>{campaign.validUntil}</strong>
                  </p>
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Segment Tabs */}
          <IonSegment value={selectedTab} onIonChange={(e) => setSelectedTab(e.detail.value as string)}>
            <IonSegmentButton value="overview">
              <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>Overview</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="participating">
              <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>Shops</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="terms">
              <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>Terms</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <IonCard
              style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '16px 0' }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <IonText>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>About This Campaign</h3>
                  <p style={{ margin: 0, fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                    {campaign.overview}
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}

          {selectedTab === 'participating' && (
            <IonCard
              style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '16px 0' }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <IonText>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
                    {campaign.offers.length} Participating Locations
                  </h3>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
                    Tap below to view all participating shops
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}

          {selectedTab === 'terms' && (
            <IonCard
              style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '16px 0' }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <IonText>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>Terms & Conditions</h3>
                </IonText>
                <IonList lines="none" style={{ padding: 0 }}>
                  {campaign.terms.map((term, index) => (
                    <IonItem key={index} style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
                      <IonIcon
                        icon={checkmarkCircleOutline}
                        slot="start"
                        style={{ fontSize: '20px', color: '#2dd36f', marginRight: '8px' }}
                      />
                      <IonLabel className="ion-text-wrap">
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{term}</p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {/* CTA Button */}
          <IonButton
            expand="block"
            size="large"
            color="primary"
            onClick={() => history.push(`/promo/${campaignId}/offers`)}
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              height: '52px',
              marginTop: '16px',
            }}
          >
            View Participating Shops
            <IonIcon icon={arrowForwardOutline} slot="end" />
          </IonButton>

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CampaignLandingPage;
