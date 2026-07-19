'use client'

import { useState } from 'react'
import { ArticleBlock } from '@/lib/types'
import { Plus, Trash2, ArrowUp, ArrowDown, Type, Heading as HeadingIcon, Image as ImageIcon, Quote, Video as VideoIcon } from 'lucide-react'

interface BlockEditorProps {
  initialBlocks?: ArticleBlock[]
  onChange: (blocks: ArticleBlock[]) => void
}

export default function BlockEditor({ initialBlocks = [], onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<ArticleBlock[]>(
    initialBlocks.length > 0 
      ? initialBlocks 
      : [{ id: 'init-1', type: 'paragraph', value: '', meta: {} }]
  )

  const updateBlocks = (newBlocks: ArticleBlock[]) => {
    setBlocks(newBlocks)
    onChange(newBlocks)
  }

  const addBlock = (type: ArticleBlock['type']) => {
    const newBlock: ArticleBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      value: '',
      meta: type === 'heading' ? { level: 2 } : type === 'image' ? { caption: '' } : {}
    }
    updateBlocks([...blocks, newBlock])
  }

  const handleValueChange = (id: string, value: string) => {
    const updated = blocks.map(b => (b.id === id ? { ...b, value } : b))
    updateBlocks(updated)
  }

  const handleMetaChange = (id: string, metaKey: string, metaVal: any) => {
    const updated = blocks.map(b => {
      if (b.id === id) {
        return {
          ...b,
          meta: {
            ...b.meta,
            [metaKey]: metaVal
          }
        }
      }
      return b
    })
    updateBlocks(updated)
  }

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) {
      // Keep at least one paragraph block
      updateBlocks([{ id: 'init-1', type: 'paragraph', value: '', meta: {} }])
      return
    }
    const updated = blocks.filter(b => b.id !== id)
    updateBlocks(updated)
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const updated = [...blocks]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    updateBlocks(updated)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="flex items-start space-x-3 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-4 group relative shadow-sm"
          >
            {/* Reorder and Action Tools */}
            <div className="flex flex-col space-y-1 items-center shrink-0">
              <button
                type="button"
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0}
                className="p-1 hover:bg-paper-warm/80 dark:hover:bg-gray-800 rounded disabled:opacity-30 text-ink-navy/60 dark:text-gray-400"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, 'down')}
                disabled={index === blocks.length - 1}
                className="p-1 hover:bg-paper-warm/80 dark:hover:bg-gray-800 rounded disabled:opacity-30 text-ink-navy/60 dark:text-gray-400"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => deleteBlock(block.id)}
                className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded mt-1 opacity-20 group-hover:opacity-100 transition-opacity"
                title="Delete Block"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Block Input Content */}
            <div className="flex-grow space-y-3">
              {block.type === 'paragraph' && (
                <div className="space-y-1">
                  <span className="flex items-center space-x-1 text-[9px] font-mono font-bold text-ink-navy/40 uppercase">
                    <Type className="w-3 h-3 text-amber" />
                    <span>Paragraph</span>
                  </span>
                  <textarea
                    value={block.value}
                    onChange={(e) => handleValueChange(block.id, e.target.value)}
                    placeholder="Start typing your paragraph content..."
                    rows={3}
                    className="w-full text-sm bg-transparent border-0 outline-none resize-none text-ink-navy dark:text-paper-warm placeholder-ink-navy/35 focus:ring-0"
                  />
                </div>
              )}

              {block.type === 'heading' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1 text-[9px] font-mono font-bold text-ink-navy/40 uppercase">
                      <HeadingIcon className="w-3 h-3 text-amber" />
                      <span>Heading Block</span>
                    </span>
                    <select
                      value={block.meta?.level || 2}
                      onChange={(e) => handleMetaChange(block.id, 'level', parseInt(e.target.value))}
                      className="text-[10px] font-mono bg-paper-warm dark:bg-gray-850 px-2 py-0.5 rounded text-ink-navy dark:text-paper-warm border border-ink-navy/5"
                    >
                      <option value={1}>H1 (Large)</option>
                      <option value={2}>H2 (Medium)</option>
                      <option value={3}>H3 (Small)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) => handleValueChange(block.id, e.target.value)}
                    placeholder="Enter heading title..."
                    className="w-full text-base font-bold bg-transparent border-0 outline-none text-ink-navy dark:text-paper-warm placeholder-ink-navy/35 focus:ring-0"
                  />
                </div>
              )}

              {block.type === 'quote' && (
                <div className="space-y-1">
                  <span className="flex items-center space-x-1 text-[9px] font-mono font-bold text-ink-navy/40 uppercase">
                    <Quote className="w-3 h-3 text-amber" />
                    <span>Quote / Editorial Callout</span>
                  </span>
                  <textarea
                    value={block.value}
                    onChange={(e) => handleValueChange(block.id, e.target.value)}
                    placeholder="Enter blockquote text..."
                    rows={2}
                    className="w-full text-sm italic border-l-2 border-amber pl-3 bg-transparent outline-none resize-none text-ink-navy dark:text-paper-warm placeholder-ink-navy/35 focus:ring-0"
                  />
                </div>
              )}

              {block.type === 'image' && (
                <div className="space-y-2">
                  <span className="flex items-center space-x-1 text-[9px] font-mono font-bold text-ink-navy/40 uppercase">
                    <ImageIcon className="w-3 h-3 text-amber" />
                    <span>Image Block</span>
                  </span>
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) => handleValueChange(block.id, e.target.value)}
                    placeholder="Paste Image URL (Unsplash or Supabase storage path)"
                    className="w-full text-xs px-2.5 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 rounded outline-none text-ink-navy dark:text-paper-warm placeholder-ink-navy/30 focus:border-amber"
                  />
                  <input
                    type="text"
                    value={block.meta?.caption || ''}
                    onChange={(e) => handleMetaChange(block.id, 'caption', e.target.value)}
                    placeholder="Optional image caption / attribution"
                    className="w-full text-[11px] px-2.5 py-1.5 bg-transparent border-0 border-b border-ink-navy/5 outline-none text-ink-navy/70 dark:text-gray-400 placeholder-ink-navy/30 focus:border-amber focus:ring-0"
                  />
                </div>
              )}

              {block.type === 'embed' && (
                <div className="space-y-2">
                  <span className="flex items-center space-x-1 text-[9px] font-mono font-bold text-ink-navy/40 uppercase">
                    <VideoIcon className="w-3 h-3 text-amber" />
                    <span>Video / Audio Embed Code</span>
                  </span>
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) => handleValueChange(block.id, e.target.value)}
                    placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ or 'ad_marker'"
                    className="w-full text-xs px-2.5 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 rounded outline-none text-ink-navy dark:text-paper-warm placeholder-ink-navy/30 focus:border-amber"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Block addition controls */}
      <div className="flex flex-wrap gap-2.5 bg-white/50 dark:bg-gray-900/30 border border-dashed border-ink-navy/10 dark:border-gray-800 rounded-lg p-4 justify-center items-center">
        <span className="text-[10px] font-mono text-ink-navy/50 dark:text-gray-500 uppercase mr-2 font-bold">
          Insert Block:
        </span>
        <button
          type="button"
          onClick={() => addBlock('paragraph')}
          className="flex items-center space-x-1 bg-white dark:bg-gray-800 hover:border-amber border border-ink-navy/10 dark:border-gray-700 px-3 py-1.5 rounded text-xs text-ink-navy dark:text-paper-warm transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Paragraph</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('heading')}
          className="flex items-center space-x-1 bg-white dark:bg-gray-800 hover:border-amber border border-ink-navy/10 dark:border-gray-700 px-3 py-1.5 rounded text-xs text-ink-navy dark:text-paper-warm transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Heading</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('quote')}
          className="flex items-center space-x-1 bg-white dark:bg-gray-800 hover:border-amber border border-ink-navy/10 dark:border-gray-700 px-3 py-1.5 rounded text-xs text-ink-navy dark:text-paper-warm transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Quote</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('image')}
          className="flex items-center space-x-1 bg-white dark:bg-gray-800 hover:border-amber border border-ink-navy/10 dark:border-gray-700 px-3 py-1.5 rounded text-xs text-ink-navy dark:text-paper-warm transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Image</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('embed')}
          className="flex items-center space-x-1 bg-white dark:bg-gray-800 hover:border-amber border border-ink-navy/10 dark:border-gray-700 px-3 py-1.5 rounded text-xs text-ink-navy dark:text-paper-warm transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Embed / Ad</span>
        </button>
      </div>
    </div>
  )
}
