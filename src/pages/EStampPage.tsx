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
  getPlatforms,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { EStampPage } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const EStampPageComponent: React.FC = () => {
  const history = useHistory();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<EStampPage | null>(null);
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
      const eStampData = await aemService.getEStampPage();
      setContent(eStampData);
      setError(null);
    } catch (err) {
      console.error('Error loading eStamp page content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - User's eStamp collections
  const stampCollections: any[] = [];
  // Example structure:
  // {
  //   id: string,
  //   merchantName: string,
  //   merchantLogo: string,
  //   currentStamps: number,
  //   totalStamps: number,
  //   reward: string,
  //   expiryDate: string,
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
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>
            {content.stampicon || '🎫'}
          </div>
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>{content.title}</h1>
            <p style={{ fontSize: '16px', margin: '0', opacity: 0.9 }}>
              {content.description.plaintext}
            </p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* How to Earn Section */}
          <IonCard
            style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}
          >
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  {content.howtoearntitle}
                </h3>
                <p style={{ margin: 0, fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                  {content.howtoearndescription.plaintext}
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* My eStamps Section */}
          <IonText>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
              My eStamp Collections
            </h2>
          </IonText>

          {/* Stamp Collections List */}
          {stampCollections.length === 0 ? (
            <IonCard
              style={{
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                margin: '0 0 16px 0',
              }}
            >
              <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  {content.stampicon || '🎫'}
                </div>
                <IonText color="medium">
                  <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>
                    {content.emptystampmessage}
                  </h3>
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    Start collecting stamps at participating merchants!
                  </p>
                  <p style={{ fontSize: '14px', margin: '16px 0 0 0', color: '#999' }}>
                    {/* TODO: Fetch user's stamp collections from Loyalty API */}
                    TODO: Fetch eStamp collections from Loyalty API
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ) : (
            stampCollections.map((collection) => (
              <IonCard
                key={collection.id}
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  margin: '0 0 12px 0',
                }}
              >
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
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
                      {collection.merchantLogo || '🏪'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <IonText>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                          {collection.merchantName}
                        </h3>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                          Reward: {collection.reward}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                          Expires: {collection.expiryDate}
                        </p>
                      </IonText>
                    </div>
                  </div>

                  {/* Stamp Progress */}
                  <div style={{ marginBottom: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <IonText>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                          {collection.currentStamps} / {collection.totalStamps} stamps
                        </p>
                      </IonText>
                      <IonText color="primary">
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                          {Math.round((collection.currentStamps / collection.totalStamps) * 100)}%
                        </p>
                      </IonText>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        background: '#e0e0e0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(collection.currentStamps / collection.totalStamps) * 100}%`,
                          background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Stamp Dots */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Array.from({ length: collection.totalStamps }).map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: index < collection.currentStamps
                            ? 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)'
                            : '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                        }}
                      >
                        {index < collection.currentStamps ? '✓' : ''}
                      </div>
                    ))}
                  </div>
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
            Find Participating Merchants
          </IonButton>

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EStampPageComponent;
