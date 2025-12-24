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
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline, checkmarkCircleOutline, shareOutline, copyOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { ReferAFriend } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const ReferAFriendPage: React.FC = () => {
  const history = useHistory();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<ReferAFriend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      const referData = await aemService.getReferAFriend();
      setContent(referData);
      setError(null);
    } catch (err) {
      console.error('Error loading refer a friend content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - User's referral code and statistics
  const referralData = {
    code: 'DEMO123', // TODO: Replace with actual user referral code
    totalReferrals: 0, // TODO: Replace with actual referral count
    pendingRewards: 0, // TODO: Replace with actual pending rewards
    earnedRewards: 0, // TODO: Replace with actual earned rewards
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    // TODO: Implement native share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Join Octopus Rewards',
        text: `Use my referral code ${referralData.code} to join Octopus Rewards and earn bonus points!`,
        url: window.location.origin,
      });
    } else {
      handleCopyCode();
    }
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
          <IonTitle style={{ color: 'black', fontWeight: 'bold' }}>{content.title}</IonTitle>
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
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>
            {content.headerimage || '🎁'}
          </div>
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>{content.title}</h1>
            <p style={{ fontSize: '16px', margin: '0', opacity: 0.9 }}>
              {content.description.plaintext}
            </p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Referral Code Card */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px', textAlign: 'center' }}>
              <IonText>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
                  {content.referralcodelabel}
                </p>
                <h2
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '36px',
                    fontWeight: 'bold',
                    letterSpacing: '4px',
                    color: 'var(--ion-color-primary)',
                  }}
                >
                  {/* TODO: Replace with actual user referral code from Loyalty API */}
                  {referralData.code}
                </h2>
              </IonText>
              <div style={{ display: 'flex', gap: '12px' }}>
                <IonButton
                  expand="block"
                  size="large"
                  onClick={handleShare}
                  style={{ fontWeight: 'bold', fontSize: '16px', height: '52px', flex: 1 }}
                >
                  <IonIcon icon={shareOutline} slot="start" />
                  {content.sharebuttonlabel}
                </IonButton>
                <IonButton
                  expand="block"
                  size="large"
                  fill="outline"
                  onClick={handleCopyCode}
                  style={{ fontWeight: 'bold', fontSize: '16px', height: '52px', width: '52px' }}
                >
                  <IonIcon icon={copyOutline} />
                </IonButton>
              </div>
              {copied && (
                <IonText color="success">
                  <p style={{ margin: '12px 0 0 0', fontSize: '14px' }}>Code copied to clipboard!</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>

          {/* Referral Statistics */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>Your Referral Stats</h3>
              </IonText>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <IonText>
                    <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                      {/* TODO: Replace with actual data from Loyalty API */}
                      {referralData.totalReferrals}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Total Referrals</p>
                  </IonText>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <IonText>
                    <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                      {referralData.pendingRewards}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Pending</p>
                  </IonText>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <IonText>
                    <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                      {referralData.earnedRewards}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Earned</p>
                  </IonText>
                </div>
              </div>
              <IonText>
                <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: '#999', textAlign: 'center' }}>
                  {/* TODO: Fetch referral statistics from Loyalty API */}
                  TODO: Fetch referral data from Loyalty API
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* How It Works */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  {content.howitworkstitle}
                </h3>
              </IonText>
              <IonList lines="none" style={{ padding: 0 }}>
                {content.howitworksdescription.plaintext.split('\n').map((step, index) => (
                  step.trim() && (
                    <IonItem key={index} style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
                      <IonIcon
                        icon={checkmarkCircleOutline}
                        slot="start"
                        style={{ fontSize: '20px', color: '#2dd36f', marginRight: '8px' }}
                      />
                      <IonLabel className="ion-text-wrap">
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{step.trim()}</p>
                      </IonLabel>
                    </IonItem>
                  )
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Terms & Conditions */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  Terms & Conditions
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  {content.termsandconditions.plaintext}
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

export default ReferAFriendPage;
