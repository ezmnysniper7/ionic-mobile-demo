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
  IonBadge,
  getPlatforms,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline, calendarOutline, chevronForwardOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { Campaign } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const CampaignPage: React.FC = () => {
  const history = useHistory();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<Campaign | null>(null);
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
      const campaignData = await aemService.getCampaignPage();
      setContent(campaignData);
      setError(null);
    } catch (err) {
      console.error('Error loading campaign content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - Active campaigns
  const campaigns: any[] = [];
  // Example structure:
  // {
  //   id: string,
  //   title: string,
  //   description: string,
  //   bannerImage: string,
  //   startDate: string,
  //   endDate: string,
  //   rewardType: string,
  //   rewardValue: string,
  //   participatingMerchants: number,
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
        {/* Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎉</div>
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>{content.title}</h1>
            <p style={{ fontSize: '16px', margin: '0', opacity: 0.9 }}>
              {content.description.plaintext}
            </p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Campaigns List */}
          {campaigns.length === 0 ? (
            <IonCard
              style={{
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                margin: '20px 0',
              }}
            >
              <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <IonText color="medium">
                  <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>No Active Campaigns</h3>
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    Check back soon for exciting new campaigns and promotions!
                  </p>
                  <p style={{ fontSize: '14px', margin: '16px 0 0 0', color: '#999' }}>
                    {/* TODO: Fetch active campaigns from Loyalty API */}
                    TODO: Fetch campaigns from Loyalty API
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ) : (
            campaigns.map((campaign) => (
              <IonCard
                key={campaign.id}
                button
                onClick={() => history.push(`/campaigns/${campaign.id}`)}
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  margin: '0 0 12px 0',
                }}
              >
                {/* Campaign Banner Image */}
                {campaign.bannerImage && (
                  <div
                    style={{
                      height: '150px',
                      background: `url(${campaign.bannerImage}) center/cover, linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)`,
                      borderRadius: '12px 12px 0 0',
                    }}
                  />
                )}
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <IonText>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                        {campaign.title}
                      </h3>
                    </IonText>
                    <IonBadge
                      color="success"
                      style={{ fontSize: '12px', padding: '4px 8px', fontWeight: 'bold' }}
                    >
                      {campaign.rewardValue}
                    </IonBadge>
                  </div>
                  <IonText>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                      {campaign.description}
                    </p>
                  </IonText>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '14px', color: '#999' }} />
                    <IonText>
                      <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                        {campaign.startDate} - {campaign.endDate}
                      </p>
                    </IonText>
                  </div>
                  <IonText>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-color-primary)', fontWeight: '500' }}>
                      {campaign.participatingMerchants} participating merchants
                    </p>
                  </IonText>
                  <IonIcon
                    icon={chevronForwardOutline}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#ccc'
                    }}
                  />
                </IonCardContent>
              </IonCard>
            ))
          )}

          {/* Terms & Conditions */}
          {content.termsandconditions && (
            <IonCard
              style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '16px 0' }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <IonText>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
                    General Terms & Conditions
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    {content.termsandconditions.plaintext}
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CampaignPage;
