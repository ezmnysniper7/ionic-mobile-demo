// Use proxy in development to avoid CORS issues
// In production, use direct AEM URL (backend team must whitelist the domain)
const AEM_BASE_URL = import.meta.env.DEV
  ? '/aem-api'
  : 'https://publish-p171769-e1846736.adobeaemcloud.com/graphql/execute.json/octopusprogram';

/**
 * AEM Service for fetching static content from Adobe Experience Manager
 * All methods return static page layouts, labels, and configuration.
 * Dynamic data (merchants, offers, user data) should come from Loyalty API.
 */
class AEMService {
  private baseUrl: string;

  constructor(baseUrl: string = AEM_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch method for AEM GraphQL endpoints
   */
  private async fetchAEM<T>(queryName: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${queryName}`);
      if (!response.ok) {
        throw new Error(`AEM API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching AEM content for ${queryName}:`, error);
      throw error;
    }
  }

  /**
   * Get all merchant categories (used for filtering on Merchant Listing page)
   */
  async getMerchantCategories() {
    const response = await this.fetchAEM<any>('getAllMerchantCategories');
    return response.data.merchantcategoryList.items;
  }

  /**
   * Get homepage static content (titles, banners, settings)
   */
  async getHomepage() {
    const response = await this.fetchAEM<any>('getHomepage');
    return response.data.homepageList.items[0];
  }

  /**
   * Get merchant listing page static content (labels, filter settings)
   */
  async getMerchantListing() {
    const response = await this.fetchAEM<any>('getMerchantListing');
    return response.data.merchantlistingList.items[0];
  }

  /**
   * Get merchant landing/detail page static content (labels, section titles)
   */
  async getMerchantLanding() {
    const response = await this.fetchAEM<any>('getMerchantLanding');
    return response.data.merchantlandingList.items[0];
  }

  /**
   * Get eStamp page static content (labels, instructions)
   */
  async getEStampPage() {
    const response = await this.fetchAEM<any>('getEStampPage');
    return response.data.estamppageList.items[0];
  }

  /**
   * Get coupon list page static content (tab labels, empty state messages)
   */
  async getCouponListPage() {
    const response = await this.fetchAEM<any>('getCouponListPage');
    return response.data.couponlistList.items[0];
  }

  /**
   * Get coupon detail page static content (button labels, section titles)
   */
  async getCouponDetail() {
    const response = await this.fetchAEM<any>('getCouponDetail');
    return response.data.coupondetailList.items[0];
  }

  /**
   * Get campaign page static content (titles, descriptions)
   */
  async getCampaignPage() {
    const response = await this.fetchAEM<any>('getCampaignPage');
    return response.data.campaignList.items[0];
  }

  /**
   * Get mission page static content (labels, status text)
   */
  async getMissionPage() {
    const response = await this.fetchAEM<any>('getMissionPage');
    return response.data.missionList.items[0];
  }

  /**
   * Get refer a friend page static content (labels, instructions)
   */
  async getReferAFriend() {
    const response = await this.fetchAEM<any>('getReferAFriend');
    return response.data.referafriendList.items[0];
  }
}

// Export singleton instance
export const aemService = new AEMService();
export default aemService;
