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
  IonProgressBar,
  getPlatforms,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline, trophyOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { Mission } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const MissionPage: React.FC = () => {
  const history = useHistory();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<Mission | null>(null);
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
      const missionData = await aemService.getMissionPage();
      setContent(missionData);
      setError(null);
    } catch (err) {
      console.error('Error loading mission content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - User's missions
  const missions: any[] = [];
  // Example structure:
  // {
  //   id: string,
  //   title: string,
  //   description: string,
  //   status: 'completed' | 'in_progress' | 'locked',
  //   currentProgress: number,
  //   totalProgress: number,
  //   reward: string,
  //   rewardPoints: number,
  //   expiryDate: string,
  // }

  const getStatusBadge = (status: string) => {
    if (!content) return null;

    switch (status) {
      case 'completed':
        return (
          <IonBadge color="success" style={{ fontSize: '11px', padding: '4px 8px' }}>
            {content.completedlabel}
          </IonBadge>
        );
      case 'in_progress':
        return (
          <IonBadge color="warning" style={{ fontSize: '11px', padding: '4px 8px' }}>
            {content.inprogresslabel}
          </IonBadge>
        );
      default:
        return null;
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
            {content.missionicon || '🎯'}
          </div>
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>{content.title}</h1>
            <p style={{ fontSize: '16px', margin: '0', opacity: 0.9 }}>
              {content.description.plaintext}
            </p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Missions List */}
          {missions.length === 0 ? (
            <IonCard
              style={{
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                margin: '20px 0',
              }}
            >
              <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
                <IonText color="medium">
                  <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>No Missions Available</h3>
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    Check back soon for new missions to complete!
                  </p>
                  <p style={{ fontSize: '14px', margin: '16px 0 0 0', color: '#999' }}>
                    {/* TODO: Fetch user's missions from Loyalty API */}
                    TODO: Fetch missions from Loyalty API
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ) : (
            missions.map((mission) => (
              <IonCard
                key={mission.id}
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  margin: '0 0 12px 0',
                  opacity: mission.status === 'completed' ? 0.8 : 1,
                }}
              >
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <IonText>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                          {mission.title}
                        </h3>
                      </IonText>
                      {getStatusBadge(mission.status)}
                    </div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    >
                      🎯
                    </div>
                  </div>

                  <IonText>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                      {mission.description}
                    </p>
                  </IonText>

                  {/* Progress Bar */}
                  {mission.status === 'in_progress' && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <IonText>
                          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                            Progress: {mission.currentProgress}/{mission.totalProgress}
                          </p>
                        </IonText>
                        <IonText color="primary">
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
                            {Math.round((mission.currentProgress / mission.totalProgress) * 100)}%
                          </p>
                        </IonText>
                      </div>
                      <IonProgressBar
                        value={mission.currentProgress / mission.totalProgress}
                        style={{ height: '8px', borderRadius: '4px' }}
                      />
                    </div>
                  )}

                  {/* Reward Section */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IonIcon icon={trophyOutline} style={{ fontSize: '20px', color: 'var(--ion-color-primary)' }} />
                      <IonText>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                          {content.rewardlabel}:
                        </p>
                      </IonText>
                    </div>
                    <IonText>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                        {mission.reward}
                      </p>
                    </IonText>
                  </div>

                  {/* Expiry Date */}
                  {mission.expiryDate && mission.status !== 'completed' && (
                    <IonText>
                      <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#999', textAlign: 'center' }}>
                        Expires: {mission.expiryDate}
                      </p>
                    </IonText>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          )}

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

export default MissionPage;
