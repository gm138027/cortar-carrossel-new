import { useRouter } from 'next/router';

/**
 * 自定义Hook：管理页面导航逻辑
 * 职责：处理页面路由跳转和页面内滚动
 */
export const useNavigation = () => {
  const router = useRouter();
  
  // 检测当前是否在首页
  const isHomePage = router.pathname === '/';
  
  /**
   * 导航到首页或滚动到顶部
   * - 在首页时：滚动到页面顶部
   * - 在子页面时：跳转到首页
   */
  const navigateHome = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };
  
  /**
   * 导航到FAQ区域
   * - 在首页时：滚动到FAQ区域
   * - 在子页面时：跳转到首页的FAQ区域
   */
  const navigateToFaq = () => {
    if (isHomePage) {
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/#faq');
    }
  };
  
  return {
    isHomePage,
    navigateHome,
    navigateToFaq
  };
};
