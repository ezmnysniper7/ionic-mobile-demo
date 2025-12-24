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
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
  getPlatforms,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import aemService from '../services/aemService';
import { MerchantListing, MerchantCategory } from '../types/aem.types';
import { useIsRootPage } from '../hooks/useIsRootPage';
import NativeBridge from '../bridge/nativeBridge';

const MerchantListingPage: React.FC = () => {
  const history = useHistory();
  const isRoot = useIsRootPage();
  const [content, setContent] = useState<MerchantListing | null>(null);
  const [categories, setCategories] = useState<MerchantCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
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
      const [merchantListingData, categoriesData] = await Promise.all([
        aemService.getMerchantListing(),
        aemService.getMerchantCategories(),
      ]);
      setContent(merchantListingData);
      setCategories(categoriesData.sort((a: MerchantCategory, b: MerchantCategory) => a.sortorder - b.sortorder));
      setError(null);
    } catch (err) {
      console.error('Error loading merchant listing content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch from Loyalty API - Actual merchant data
  const merchants: any[] = [];
  // Example structure:
  // {
  //   id: string,
  //   name: string,
  //   category: string,
  //   description: string,
  //   logo: string,
  //   district: string,
  // }

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesCategory = selectedCategory === 'all' || merchant.category === selectedCategory;
    const matchesSearch = merchant.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          {/* Description */}
          <IonText>
            <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>
              {content.description.plaintext}
            </p>
          </IonText>

          {/* Search Bar - conditionally shown */}
          {content.showsearch && (
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value!)}
              placeholder="Search merchants..."
              style={{ '--background': 'white', '--border-radius': '12px', marginBottom: '16px' }}
            />
          )}

          {/* Category Filter - conditionally shown */}
          {content.showfilter && categories.length > 0 && (
            <IonSegment
              value={selectedCategory}
              onIonChange={(e) => setSelectedCategory(e.detail.value as string)}
              scrollable
              style={{ marginBottom: '16px' }}
            >
              <IonSegmentButton value="all">
                <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>All</IonLabel>
              </IonSegmentButton>
              {categories.map((category) => (
                <IonSegmentButton key={category.id} value={category.id}>
                  <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>{category.name}</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          )}

          {/* Merchant List */}
          {filteredMerchants.length === 0 ? (
            <IonCard
              style={{
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                margin: '20px 0',
              }}
            >
              <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
                <IonText color="medium">
                  <p style={{ fontSize: '16px', margin: 0 }}>{content.emptystatemessage}</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ) : (
            filteredMerchants.map((merchant) => (
              <IonCard
                key={merchant.id}
                button
                onClick={() => history.push(`/merchants/${merchant.id}`)}
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
                      {merchant.logo || '🏪'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <IonText>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                          {merchant.name}
                        </h3>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                          {merchant.description}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{merchant.district}</p>
                      </IonText>
                    </div>
                    <IonIcon icon={chevronForwardOutline} style={{ fontSize: '20px', color: '#ccc', marginTop: '16px' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}

          {/* TODO: Fetch merchant list from Loyalty API */}
          <IonCard
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              margin: '20px 0',
            }}
          >
            <IonCardContent style={{ padding: '40px 20px', textAlign: 'center' }}>
              <IonText color="medium">
                <p style={{ fontSize: '16px', margin: 0 }}>
                  {/* This will show actual merchants from Loyalty API */}
                  TODO: Fetch merchant list from Loyalty API
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

export default MerchantListingPage;
