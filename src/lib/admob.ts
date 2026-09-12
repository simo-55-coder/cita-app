import { AdMob, BannerAdSize, BannerAdPosition, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AD_IDS = {
  appId: 'ca-app-pub-7324484239704652~2630492135',
  banner: 'ca-app-pub-7324484239704652/6271007210',
  rewarded: 'ca-app-pub-7324484239704652/3791882213',
};

export const initAdMob = async () => {
  if (Capacitor.getPlatform() === 'web') return;
  try {
    await AdMob.initialize({
      initializeForTesting: false,
    });
  } catch (e) {
    console.warn('AdMob init failed', e);
  }
};

export const showBannerAd = async () => {
  if (Capacitor.getPlatform() === 'web') return;
  try {
    await AdMob.showBanner({
      adId: AD_IDS.banner,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 50, // Margin to sit below the Header (Header height is ~49px)
      isTesting: false,
    });
  } catch (e) {
    console.warn('Banner ad failed', e);
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  if (Capacitor.getPlatform() === 'web') {
    return true; // Safely skip in web environment
  }

  return new Promise(async (resolve) => {
    let isResolved = false;
    const finish = () => {
      if (!isResolved) {
        isResolved = true;
        resolve(true);
      }
    };

    try {
      AdMob.addListener(RewardAdPluginEvents.Dismissed, finish);
      AdMob.addListener(RewardAdPluginEvents.FailedToLoad, finish);
      AdMob.addListener(RewardAdPluginEvents.FailedToShow, finish);

      await AdMob.prepareRewardVideoAd({
        adId: AD_IDS.rewarded,
        isTesting: false,
      });

      await AdMob.showRewardVideoAd();
      
      // Fallback timeout
      setTimeout(finish, 45000);
    } catch (e) {
      console.warn('Rewarded ad failed to prepare/show', e);
      finish();
    }
  });
};
