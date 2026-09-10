import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SectionContent {
  title?: string;
  subtitle?: string;
  body_text?: string;
  quote_text?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  [key: string]: any;
}

export interface PageContentSchema {
  [sectionKey: string]: SectionContent;
}

export interface SiteCMSData {
  [pageSlug: string]: PageContentSchema;
}

const STORAGE_BUCKET = 'banners';
const CMS_FILE_NAME = 'cms_site_pages.json';
const LOCAL_STORAGE_KEY = 'soltaoverbo_cms_data_cache';

// In-memory cache & event listeners
let memoryCMSData: SiteCMSData | null = null;
const listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((l) => l());
}

export async function fetchCMSDataFromSupabase(): Promise<SiteCMSData> {
  try {
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(CMS_FILE_NAME);

    // Fetch JSON from public URL with cache busting
    const res = await fetch(`${publicUrlData.publicUrl}?t=${Date.now()}`);
    if (res.ok) {
      const data: SiteCMSData = await res.json();
      memoryCMSData = data;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      notifyListeners();
      return data;
    }
  } catch (err) {
    console.warn('não foi possível carregar CMS do supabase, usando cache local:', err);
  }

  // Fallback to local storage if available
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      memoryCMSData = JSON.parse(cached);
      return memoryCMSData!;
    } catch (e) {
      console.error(e);
    }
  }

  return memoryCMSData || {};
}

export async function saveCMSDataToSupabase(updatedCMSData: SiteCMSData): Promise<boolean> {
  try {
    memoryCMSData = updatedCMSData;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCMSData));
    notifyListeners();

    const blob = new Blob([JSON.stringify(updatedCMSData, null, 2)], { type: 'application/json' });
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(CMS_FILE_NAME, blob, { upsert: true, contentType: 'application/json' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('erro ao salvar CMS no Supabase Storage:', err);
    return false;
  }
}

export function usePageContent(pageSlug: string) {
  const [cmsData, setCmsData] = useState<SiteCMSData>(() => {
    if (memoryCMSData) return memoryCMSData;
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {};
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleUpdate = () => {
      if (isMounted && memoryCMSData) {
        setCmsData({ ...memoryCMSData });
      }
    };

    listeners.add(handleUpdate);

    fetchCMSDataFromSupabase().then((data) => {
      if (isMounted) {
        setCmsData(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      listeners.delete(handleUpdate);
    };
  }, [pageSlug]);

  const pageContent = cmsData[pageSlug] || {};

  const getSection = (sectionKey: string, defaults?: SectionContent): SectionContent => {
    const customSection = pageContent[sectionKey] || {};
    return {
      title: customSection.title ?? defaults?.title ?? '',
      subtitle: customSection.subtitle ?? defaults?.subtitle ?? '',
      body_text: customSection.body_text ?? defaults?.body_text ?? '',
      quote_text: customSection.quote_text ?? defaults?.quote_text ?? '',
      image_url: customSection.image_url ?? defaults?.image_url ?? '',
      button_text: customSection.button_text ?? defaults?.button_text ?? '',
      button_link: customSection.button_link ?? defaults?.button_link ?? '',
      ...defaults,
      ...customSection,
    };
  };

  return {
    loading,
    pageContent,
    getSection,
    cmsData,
  };
}
