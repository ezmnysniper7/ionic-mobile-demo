import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
  IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import aemService from '../services/aemService';
import { Homepage } from '../types/aem.types';

const HomePage: React.FC = () => {
  const history = useHistory();
  const [content, setContent] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const homepageData = await aemService.getHomepage();
      setContent(homepageData);
      setError(null);
    } catch (err) {
      console.error('Error loading homepage content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
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
          <IonText color="light">
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
              {content.herobannertitle}
            </h1>
            <p style={{ fontSize: '16px', margin: '0', opacity: 0.9 }}>{content.herobannersubtitle}</p>
          </IonText>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Search Bar - conditionally shown based on AEM setting */}
          {content.showsearchbar && (
            <IonSearchbar
              placeholder="Search rewards..."
              style={{ '--background': 'white', '--border-radius': '12px', marginBottom: '16px' }}
            />
          )}

          {/* TODO: Fetch from Loyalty API - Featured campaigns/offers */}
          <IonCard style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}>
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 'bold' }}>Featured Offers</h2>
                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
                  {/* TODO: Replace with actual featured offers from Loyalty API */}
                  Loading featured offers...
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* TODO: Fetch from Loyalty API - User points/rewards summary */}
          <IonCard style={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 0 16px 0' }}>
            <IonCardContent style={{ padding: '20px' }}>
              <IonText>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 'bold' }}>Your Rewards</h2>
                <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
                  {/* TODO: Replace with actual user points/rewards from Loyalty API */}
                  Loading your rewards...
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Navigation Buttons */}
          <IonButton
            expand="block"
            size="large"
            onClick={() => history.push('/merchants')}
            style={{ fontWeight: 'bold', fontSize: '16px', height: '52px', marginBottom: '12px' }}
          >
            Browse Merchants
          </IonButton>

          <IonButton
            expand="block"
            size="large"
            fill="outline"
            onClick={() => history.push('/estamp')}
            style={{ fontWeight: 'bold', fontSize: '16px', height: '52px' }}
          >
            My eStamps
          </IonButton>

          <div style={{ height: '40px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
