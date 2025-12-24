/**
 * AEM Content Type Definitions
 * These interfaces define the structure of static content from Adobe Experience Manager.
 * Dynamic data (merchants, offers, user data) comes from the Loyalty API separately.
 */

export interface MerchantCategory {
  _path: string;
  id: string;
  name: string;
  icon: string | null;
  sortorder: number;
}

export interface Homepage {
  _path: string;
  pageid: string;
  title: string;
  herobannertitle: string;
  herobannersubtitle: string;
  showsearchbar: boolean;
}

export interface MerchantListing {
  _path: string;
  pageid: string;
  title: string;
  description: {
    plaintext: string;
  };
  showfilter: boolean;
  showsearch: boolean;
  emptystatemessage: string;
}

export interface MerchantLanding {
  _path: string;
  pageid: string;
  title: string;
  headerimage: any | null;
  abouttitle: string;
  aboutdescription: {
    plaintext: string;
  };
  showoffers: boolean;
  showstores: boolean;
}

export interface EStampPage {
  _path: string;
  pageid: string;
  title: string;
  description: {
    plaintext: string;
  };
  stampicon: any | null;
  emptystampmessage: string;
  howtoearntitle: string;
  howtoearndescription: {
    plaintext: string;
  };
}

export interface CouponList {
  _path: string;
  pageid: string;
  title: string;
  availabletablabel: string;
  usedtablabel: string;
  expiredtablabel: string;
  emptystatemessage: string;
  emptystateimage: any | null;
}

export interface CouponDetail {
  _path: string;
  pageid: string;
  redeembuttonlabel: string;
  termstitle: string;
  howtousetitle: string;
  howtousedescription: {
    plaintext: string;
  };
  validitylabel: string;
}

export interface Campaign {
  _path: string;
  pageid: string;
  title: string;
  description: {
    plaintext: string;
  };
  bannerimage: any | null;
  startdate: string | null;
  enddate: string | null;
  termsandconditions: {
    plaintext: string;
  };
}

export interface Mission {
  _path: string;
  pageid: string;
  title: string;
  description: {
    plaintext: string;
  };
  missionicon: any | null;
  completedlabel: string;
  inprogresslabel: string;
  rewardlabel: string;
}

export interface ReferAFriend {
  _path: string;
  pageid: string;
  title: string;
  description: {
    plaintext: string;
  };
  headerimage: any | null;
  sharebuttonlabel: string;
  referralcodelabel: string;
  howitworkstitle: string;
  howitworksdescription: {
    plaintext: string;
  };
  termsandconditions: {
    plaintext: string;
  };
}
