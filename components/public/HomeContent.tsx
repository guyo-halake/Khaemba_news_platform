'use client'

import { useState, useEffect } from 'react'
import { Article, Video, Category } from '@/lib/types'
import EditorialHome from './EditorialHome'
import MagazineHome from './MagazineHome'

interface Props {
  articles: Article[]
  videos: Video[]
  categories: Category[]
}

export default function HomeContent({ articles, videos, categories }: Props) {
  const [layout, setLayout] = useState<'editorial' | 'magazine'>('editorial')

  useEffect(() => {
    const saved = localStorage.getItem('layoutTheme')
    if (saved === 'editorial' || saved === 'magazine') setLayout(saved)
  }, [])

  if (layout === 'magazine') {
    return <MagazineHome articles={articles} videos={videos} categories={categories} />
  }
  return <EditorialHome articles={articles} videos={videos} categories={categories} />
}
