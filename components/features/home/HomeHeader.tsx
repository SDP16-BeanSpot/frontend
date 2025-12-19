import React from 'react';

// 1. 방금 분리한 컴포넌트들을 import
import { Navbar } from '../../layout/Navbar';
import { BannerCarousel } from './BannerCarousel';
import { ServiceButtons } from './ServiceButtons';
import { FilterSection } from './FilterSection';

// 2. 부모(home.tsx)로부터 필요한 데이터와 함수를 받음
export const HomeHeader = ({ bannerData, filterData, activeFilterId, setActiveFilterId }: any) => {
  return (
    <>
      <Navbar />
      <BannerCarousel data={bannerData} />
      <ServiceButtons />
      <FilterSection 
        data={filterData} 
        activeId={activeFilterId} 
        onFilterPress={setActiveFilterId} 
      />
    </>
  );
};