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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
  IonBadge,
  getPlatforms,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline, timeOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { CouponList } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const CouponListPage: React.FC = () => {
  const history = useHistory();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<CouponList | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('available');
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
      const couponListData = await aemService.getCouponListPage();
      setContent(couponListData);
      setError(null);
    } catch (err) {
      console.error('Error loading coupon list content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - User's coupons
  const availableCoupons: any[] = [];
  const usedCoupons: any[] = [];
  const expiredCoupons: any[] = [];
  // Example structure:
  // {
  //   id: string,
  //   title: string,
  //   description: string,
  //   merchantName: string,
  //   merchantLogo: string,
  //   discountValue: string,
  //   validUntil: string,
  //   code: string,
  // }

  const getCouponsForTab = () => {
    switch (selectedTab) {
      case 'available':
        return availableCoupons;
      case 'used':
        return usedCoupons;
      case 'expired':
        return expiredCoupons;
      default:
        return [];
    }
  };

  const currentCoupons = getCouponsForTab();

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
        <div style={{ padding: '16px' }}>
          {/* Tabs */}
          <IonSegment value={selectedTab} onIonChange={(e) => setSelectedTab(e.detail.value as string)}>
            <IonSegmentButton value="available">
              <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>{content.availabletablabel}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="used">
              <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>{content.usedtablabel}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="expired">
              <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>{content.expiredtablabel}</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* Coupons List */}
          <div style={{ marginTop: '16px' }}>
            {currentCoupons.length === 0 ? (
              <IonCard
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  margin: '20px 0',
                }}
              >
                <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
                  {content.emptystateimage ? (
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎟️</div>
                  ) : (
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎟️</div>
                  )}
                  <IonText color="medium">
                    <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>{content.emptystatemessage}</h3>
                    <p style={{ fontSize: '14px', margin: 0 }}>
                      Browse merchants to discover exclusive coupons!
                    </p>
                    <p style={{ fontSize: '14px', margin: '16px 0 0 0', color: '#999' }}>
                      {/* TODO: Fetch user's coupons from Loyalty API */}
                      TODO: Fetch coupons from Loyalty API
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            ) : (
              currentCoupons.map((coupon) => (
                <IonCard
                  key={coupon.id}
                  button
                  onClick={() => history.push(`/coupons/${coupon.id}`)}
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    margin: '0 0 12px 0',
                    opacity: selectedTab === 'expired' || selectedTab === 'used' ? 0.6 : 1,
                  }}
                >
                  <IonCardContent style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '40px',
                        }}
                      >
                        {coupon.merchantLogo || '🏪'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                          <IonText>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                              {coupon.title}
                            </h3>
                          </IonText>
                          <IonBadge
                            color="success"
                            style={{ fontSize: '12px', padding: '4px 8px', fontWeight: 'bold' }}
                          >
                            {coupon.discountValue}
                          </IonBadge>
                        </div>
                        <IonText>
                          <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                            {coupon.merchantName}
                          </p>
                          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
                            {coupon.description}
                          </p>
                        </IonText>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <IonIcon icon={timeOutline} style={{ fontSize: '14px', color: '#999' }} />
                          <IonText>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                              Valid until: {coupon.validUntil}
                            </p>
                          </IonText>
                        </div>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </div>

          <IonButton
            expand="block"
            size="large"
            onClick={() => history.push('/merchants')}
            style={{ fontWeight: 'bold', fontSize: '16px', height: '52px', marginTop: '16px' }}
          >
            Browse Merchants
          </IonButton>

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CouponListPage;
