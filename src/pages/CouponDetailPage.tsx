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
  IonList,
  IonItem,
  IonLabel,
  getPlatforms,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { CouponDetail } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const CouponDetailPage: React.FC = () => {
  const history = useHistory();
  const { couponId } = useParams<{ couponId: string }>();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<CouponDetail | null>(null);
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
      const couponDetailData = await aemService.getCouponDetail();
      setContent(couponDetailData);
      setError(null);
    } catch (err) {
      console.error('Error loading coupon detail content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - Actual coupon data by couponId
  const coupon = {
    // Example structure:
    // id: string,
    // title: string,
    // description: string,
    // merchantName: string,
    // merchantLogo: string,
    // discountValue: string,
    // validUntil: string,
    // code: string,
    // terms: string[],
    // isRedeemed: boolean,
  };

  const handleRedeem = () => {
    // TODO: Call Loyalty API to redeem coupon
    console.log('Redeeming coupon:', couponId);
  };

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
          <IonTitle style={{ color: 'black', fontWeight: 'bold' }}>Coupon Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f5f5f5' }}>
        {/* Hero Section - TODO: Replace with actual coupon data */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎟️</div>
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
              {/* TODO: coupon.title from Loyalty API */}
              Coupon Title
            </h1>
            <p style={{ fontSize: '16px', margin: '0 0 8px 0', opacity: 0.9 }}>
              {/* TODO: coupon.merchantName from Loyalty API */}
              Merchant Name
            </p>
            <p style={{ fontSize: '20px', margin: '0', fontWeight: 'bold' }}>
              {/* TODO: coupon.discountValue from Loyalty API */}
              20% OFF
            </p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Coupon Code Card */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px', textAlign: 'center' }}>
              <IonText>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>Coupon Code</p>
                <h2
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    letterSpacing: '4px',
                    color: 'var(--ion-color-primary)',
                  }}
                >
                  {/* TODO: coupon.code from Loyalty API */}
                  SAVE20
                </h2>
              </IonText>
              <IonButton
                expand="block"
                size="large"
                onClick={handleRedeem}
                style={{ fontWeight: 'bold', fontSize: '16px', height: '52px' }}
              >
                {content.redeembuttonlabel}
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* How to Use Section */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  {content.howtousetitle}
                </h3>
                <p style={{ margin: 0, fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                  {content.howtousedescription.plaintext}
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Validity */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IonIcon icon={timeOutline} style={{ fontSize: '24px', color: 'var(--ion-color-primary)' }} />
                <div>
                  <IonText>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#999' }}>
                      {content.validitylabel}
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                      {/* TODO: coupon.validUntil from Loyalty API */}
                      December 31, 2024
                    </p>
                  </IonText>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Terms & Conditions */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  {content.termstitle}
                </h3>
              </IonText>
              <IonList lines="none" style={{ padding: 0 }}>
                {/* TODO: Replace with coupon.terms from Loyalty API */}
                {['Valid for one-time use only', 'Cannot be combined with other offers', 'Must be redeemed in-store'].map((term, index) => (
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
              <IonText>
                <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: '#999' }}>
                  {/* TODO: Fetch coupon terms from Loyalty API */}
                  TODO: Fetch coupon details and terms from Loyalty API
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CouponDetailPage;
