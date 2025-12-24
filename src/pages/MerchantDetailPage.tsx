import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  getPlatforms,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline, locationOutline, chevronForwardOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { MerchantLanding } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const MerchantDetailPage: React.FC = () => {
  const history = useHistory();
  const { merchantId } = useParams<{ merchantId: string }>();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<MerchantLanding | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('about');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect platform for back button icon
  const platforms = getPlatforms();
  const hasAndroidInterface = typeof (window as any).AndroidInterface !== 'undefined';
  const userAgentHasAndroid = /android/i.test(navigator.userAgent);
  const isAndroid = platforms.includes('android') || hasAndroidInterface || userAgentHasAndroid;
  const backIcon = isAndroid ? arrowBackOutline : chevronBackOutline;

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (isRoot) {
      NativeBridge.enableSwipeBack?.();
    } else {
      NativeBridge.disableSwipeBack?.();
    }
  }, [isRoot]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const merchantLandingData = await aemService.getMerchantLanding();
      setContent(merchantLandingData);
      setError(null);
    } catch (err) {
      console.error('Error loading merchant detail content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - Actual merchant data by merchantId
  const merchant = {
    // Example structure:
    // id: string,
    // name: string,
    // logo: string,
    // description: string,
    // category: string,
    // about: string,
  };

  // TODO: Fetch from Loyalty API - Merchant offers
  const offers: any[] = [];
  // Example structure:
  // {
  //   id: string,
  //   title: string,
  //   description: string,
  //   validUntil: string,
  //   points: string,
  // }

  // TODO: Fetch from Loyalty API - Merchant store locations
  const stores: any[] = [];
  // Example structure:
  // {
  //   id: string,
  //   name: string,
  //   address: string,
  //   district: string,
  //   hours: string,
  // }

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !content) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <IonText color="danger">
              <h2>{error || 'Content not available'}</h2>
            </IonText>
            <IonButton onClick={loadContent}>Retry</IonButton>
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
            <IonButton fill="clear" onClick={() => history.goBack()}>
              <IonIcon icon={backIcon} style={{ fontSize: '28px', color: 'black' }} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ color: 'black', fontWeight: 'bold' }}>{content.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f5f5f5' }}>
        {/* Hero Section - TODO: Replace with actual merchant data */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏪</div>
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
              {/* TODO: merchant.name from Loyalty API */}
              Merchant Name
            </h1>
            <p style={{ fontSize: '16px', margin: '0', opacity: 0.9 }}>
              {/* TODO: merchant.category from Loyalty API */}
              Category
            </p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Tabs */}
          <IonSegment value={selectedTab} onIonChange={(e) => setSelectedTab(e.detail.value as string)}>
            <IonSegmentButton value="about">
              <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>About</IonLabel>
            </IonSegmentButton>
            {content.showoffers && (
              <IonSegmentButton value="offers">
                <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>Offers</IonLabel>
              </IonSegmentButton>
            )}
            {content.showstores && (
              <IonSegmentButton value="stores">
                <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>Stores</IonLabel>
              </IonSegmentButton>
            )}
          </IonSegment>

          {/* About Tab */}
          {selectedTab === 'about' && (
            <IonCard
              style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '16px 0' }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <IonText>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
                    {content.abouttitle}
                  </h3>
                  <p style={{ margin: 0, fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                    {content.aboutdescription.plaintext}
                  </p>
                  <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: '#999' }}>
                    {/* TODO: Replace with merchant.about from Loyalty API */}
                    TODO: Fetch merchant details from Loyalty API
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}

          {/* Offers Tab */}
          {selectedTab === 'offers' && content.showoffers && (
            <div style={{ marginTop: '16px' }}>
              {offers.length === 0 ? (
                <IonCard
                  style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                >
                  <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <IonText color="medium">
                      <p style={{ fontSize: '16px', margin: 0 }}>
                        {/* TODO: Fetch offers from Loyalty API */}
                        TODO: Fetch merchant offers from Loyalty API
                      </p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              ) : (
                offers.map((offer) => (
                  <IonCard
                    key={offer.id}
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      margin: '0 0 12px 0',
                    }}
                  >
                    <IonCardContent style={{ padding: '16px' }}>
                      <IonText>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                          {offer.title}
                        </h4>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                          {offer.description}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                          Valid until: {offer.validUntil}
                        </p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                ))
              )}
            </div>
          )}

          {/* Stores Tab */}
          {selectedTab === 'stores' && content.showstores && (
            <div style={{ marginTop: '16px' }}>
              {stores.length === 0 ? (
                <IonCard
                  style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                >
                  <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <IonText color="medium">
                      <p style={{ fontSize: '16px', margin: 0 }}>
                        {/* TODO: Fetch stores from Loyalty API */}
                        TODO: Fetch merchant stores from Loyalty API
                      </p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              ) : (
                stores.map((store) => (
                  <IonCard
                    key={store.id}
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      margin: '0 0 12px 0',
                    }}
                  >
                    <IonCardContent style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <IonIcon
                          icon={locationOutline}
                          style={{ fontSize: '24px', color: 'var(--ion-color-primary)', marginTop: '4px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <IonText>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                              {store.name}
                            </h4>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                              {store.address}
                            </p>
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#999' }}>
                              {store.district}
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                              {store.hours}
                            </p>
                          </IonText>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))
              )}
            </div>
          )}

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MerchantDetailPage;
