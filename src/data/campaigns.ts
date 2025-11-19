export interface Offer {
  id: string;
  name: string;
  address: string;
  district: string;
  hours: string;
  bonus: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  points: string;
  description: string;
  overview: string;
  terms: string[];
  validUntil: string;
  offers: Offer[];
}

export const campaigns: { [key: string]: Campaign } = {
  'coffee-frenzy': {
    id: 'coffee-frenzy',
    title: 'Coffee Frenzy',
    subtitle: 'Double Points at Coffee Shops',
    heroImage: '☕',
    points: '2x Points',
    description: 'Earn double points at participating coffee shops across Hong Kong!',
    overview: 'Start your morning right with our Coffee Frenzy promotion. Visit any participating coffee shop and earn 2x points on every purchase. Whether you prefer espresso, latte, or cappuccino, your loyalty rewards grow twice as fast!',
    validUntil: '2024-08-31',
    terms: [
      'Valid at participating coffee shops only',
      'Minimum spend of HKD 30 required',
      'Points will be credited within 3 business days',
      'Cannot be combined with other promotions',
      'Octopus card must be registered to earn points',
    ],
    offers: [
      {
        id: 'star-coffee-central',
        name: 'Star Coffee',
        address: 'Shop G12, IFC Mall, Central',
        district: 'Central',
        hours: 'Mon-Fri: 7:00 AM - 9:00 PM, Sat-Sun: 8:00 AM - 8:00 PM',
        bonus: 'Earn 2x points when you spend HKD 50+',
      },
      {
        id: 'coffee-bean-mongkok',
        name: 'Coffee Bean',
        address: '123 Nathan Road, Mong Kok',
        district: 'Mong Kok',
        hours: 'Daily: 7:30 AM - 10:00 PM',
        bonus: 'Earn 2x points + free cookie with HKD 80+ purchase',
      },
      {
        id: 'latte-house-tst',
        name: 'Latte House',
        address: 'Ground Floor, Harbour City, Tsim Sha Tsui',
        district: 'Tsim Sha Tsui',
        hours: 'Daily: 8:00 AM - 11:00 PM',
        bonus: 'Earn 2x points on all purchases',
      },
      {
        id: 'brew-lab-causeway',
        name: 'Brew Lab',
        address: '456 Hennessy Road, Causeway Bay',
        district: 'Causeway Bay',
        hours: 'Mon-Fri: 6:30 AM - 8:00 PM, Sat-Sun: 8:00 AM - 6:00 PM',
        bonus: 'Earn 2x points + 10% discount on takeaway',
      },
    ],
  },
  'supermarket-weekend': {
    id: 'supermarket-weekend',
    title: 'Weekend Supermarket Cashback',
    subtitle: 'Extra Savings on Weekends',
    heroImage: '🛒',
    points: '5% Cashback',
    description: 'Get 5% cashback on supermarket purchases every weekend!',
    overview: 'Make your weekend grocery shopping more rewarding! Enjoy 5% cashback credited directly to your Octopus card when you shop at participating supermarkets on Saturdays and Sundays.',
    validUntil: '2024-09-30',
    terms: [
      'Valid on Saturday and Sunday only',
      'Minimum spend of HKD 200 required',
      'Cashback capped at HKD 50 per transaction',
      'Cashback will be credited within 7 days',
      'Excludes alcohol and tobacco products',
    ],
    offers: [
      {
        id: 'wellcome-admiralty',
        name: 'Wellcome Supermarket',
        address: 'B1, Pacific Place, Admiralty',
        district: 'Admiralty',
        hours: 'Daily: 8:00 AM - 11:00 PM',
        bonus: '5% cashback on purchases over HKD 200',
      },
      {
        id: 'parknshop-shatin',
        name: 'PARKnSHOP',
        address: 'New Town Plaza, Sha Tin',
        district: 'Sha Tin',
        hours: 'Daily: 9:00 AM - 10:00 PM',
        bonus: '5% cashback + bonus points on fresh produce',
      },
      {
        id: 'citysuper-times',
        name: 'City\'super',
        address: 'Times Square, Causeway Bay',
        district: 'Causeway Bay',
        hours: 'Daily: 10:00 AM - 10:00 PM',
        bonus: '5% cashback on all grocery items',
      },
    ],
  },
  'cinema-rewards': {
    id: 'cinema-rewards',
    title: 'Cinema Rewards',
    subtitle: 'Free Popcorn with Movie Tickets',
    heroImage: '🎬',
    points: 'Free Popcorn',
    description: 'Buy movie tickets with Octopus and get free popcorn!',
    overview: 'Lights, camera, action! Purchase your movie tickets using Octopus at participating cinemas and receive a complimentary regular popcorn. Perfect for your next movie night out!',
    validUntil: '2024-07-31',
    terms: [
      'Valid at participating cinemas only',
      'One free popcorn per ticket purchased',
      'Popcorn must be claimed on the same day',
      'Not valid for online ticket purchases',
      'Subject to cinema seating availability',
    ],
    offers: [
      {
        id: 'ua-megabox',
        name: 'UA Cinemas',
        address: 'Level 11, MegaBox, Kowloon Bay',
        district: 'Kowloon Bay',
        hours: 'Daily: 10:00 AM - 12:00 AM',
        bonus: 'Free regular popcorn with every ticket',
      },
      {
        id: 'palace-ifc',
        name: 'The Palace IFC',
        address: 'Level 1, IFC Mall, Central',
        district: 'Central',
        hours: 'Daily: 11:00 AM - 11:30 PM',
        bonus: 'Free popcorn + 20% off snacks combo',
      },
      {
        id: 'mco-tst',
        name: 'MCL Cinema',
        address: 'Level 5, iSQUARE, Tsim Sha Tsui',
        district: 'Tsim Sha Tsui',
        hours: 'Daily: 10:30 AM - 12:00 AM',
        bonus: 'Free regular popcorn + earn 3x points',
      },
    ],
  },
};
